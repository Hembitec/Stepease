import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { MutationCtx, QueryCtx } from "./_generated/server";
import { UserIdentity } from "convex/server";
import { PLAN_LIMITS } from "./constants";

// ============================================================================
// USER MANAGEMENT & SUBSCRIPTION LIFECYCLE
// ============================================================================

/**
 * Get or create a user record on first sign-in
 */
export const getOrCreate = mutation({
    args: {
        email: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const clerkId = identity.subject;

        // Check if user already exists
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
            .first();

        if (existingUser) {
            return existingUser;
        }

        // Create new user on free tier
        const now = new Date();
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        const userId = await ctx.db.insert("users", {
            clerkId,
            email: args.email,
            tier: "free",
            status: "active",
            sopsCreatedThisMonth: 0,
            improvesUsedThisMonth: 0,
            usageResetAt: nextMonth.toISOString(),
            totalPayments: 0,
        });

        return await ctx.db.get(userId);
    },
});

/**
 * Get user by Clerk ID
 */
export const getByClerkId = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user) return null;

        return {
            ...user,
            tier: getActiveTier(user),
        };
    },
});

function getActiveTier(user: any) {
    if (user.tier === "free") return "free";
    
    // If we have an expiration date and it's in the past, fallback to free
    if (user.subscriptionExpiresAt) {
        const expiresAt = new Date(user.subscriptionExpiresAt);
        if (new Date() > expiresAt) {
            return "free";
        }
    }
    
    return user.tier;
}

/**
 * Check if user can create more SOPs
 */
export const checkCanCreate = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return { canCreate: false, remaining: 0, limit: 0 };
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user) {
            // New user, allow creation (will trigger getOrCreate)
            return { canCreate: true, remaining: 2, limit: 2 };
        }

        const activeTier = getActiveTier(user);
        const limit = PLAN_LIMITS[activeTier as "free" | "starter" | "pro"].creates;
        const remaining = limit === Infinity ? Infinity : limit - user.sopsCreatedThisMonth;

        return {
            canCreate: remaining > 0,
            remaining,
            limit,
            tier: activeTier,
        };
    },
});

/**
 * Check if user can use Improve feature
 */
export const checkCanImprove = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return { canImprove: false, remaining: 0, limit: 0 };
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user) {
            return { canImprove: true, remaining: 1, limit: 1 };
        }

        const activeTier = getActiveTier(user);
        const limit = PLAN_LIMITS[activeTier as "free" | "starter" | "pro"].improves;
        const remaining = limit === Infinity ? Infinity : limit - user.improvesUsedThisMonth;

        return {
            canImprove: remaining > 0,
            remaining,
            limit,
            tier: activeTier,
        };
    },
});

/**
 * Increment SOP creation count (lazy monthly reset)
 */
export const incrementSopCount = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const user = await getOrCreateUserForIncrement(ctx, identity);
        if (!user) {
            throw new Error("Failed to get or create user");
        }

        // Lazy reset: check if billing period has passed
        const now = new Date();
        const resetDate = new Date(user.usageResetAt);

        if (now >= resetDate) {
            const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            await ctx.db.patch(user._id, {
                sopsCreatedThisMonth: 1,
                improvesUsedThisMonth: 0,
                usageResetAt: nextMonth.toISOString(),
            });
        } else {
            await ctx.db.patch(user._id, {
                sopsCreatedThisMonth: user.sopsCreatedThisMonth + 1,
            });
        }
    },
});

/**
 * Increment Improve usage count (lazy monthly reset)
 */
export const incrementImproveCount = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const user = await getOrCreateUserForIncrement(ctx, identity);
        if (!user) {
            throw new Error("Failed to get or create user");
        }

        const now = new Date();
        const resetDate = new Date(user.usageResetAt);

        if (now >= resetDate) {
            const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            await ctx.db.patch(user._id, {
                sopsCreatedThisMonth: 0,
                improvesUsedThisMonth: 1,
                usageResetAt: nextMonth.toISOString(),
            });
        } else {
            await ctx.db.patch(user._id, {
                improvesUsedThisMonth: user.improvesUsedThisMonth + 1,
            });
        }
    },
});

// ============================================================================
// SUBSCRIPTION MANAGEMENT (Webhook-driven)
// ============================================================================

/**
 * Update subscription after a successful payment (called from webhook)
 * Also records the payment in payment_history and logs to activity_log
 */
export const updateSubscription = mutation({
    args: {
        webhookSecret: v.string(),
        clerkId: v.string(),
        tier: v.union(v.literal("free"), v.literal("starter"), v.literal("pro")),
        status: v.union(
            v.literal("active"),
            v.literal("past_due"),
            v.literal("canceled"),
            v.literal("unpaid")
        ),
        flwCustomerId: v.optional(v.string()),
        flwSubscriptionId: v.optional(v.string()),
        // Payment event fields
        flwTransactionId: v.optional(v.string()),
        flwTxRef: v.optional(v.string()),
        amount: v.optional(v.number()),
        currency: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Validate webhook secret
        const expectedSecret = process.env.CONVEX_WEBHOOK_SECRET;
        if (!expectedSecret || args.webhookSecret !== expectedSecret) {
            throw new Error("Unauthorized: Invalid webhook secret");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!user) {
            throw new Error(`User not found: ${args.clerkId}`);
        }

        const now = new Date();

        // Calculate next billing period (1 month from now)
        const nextMonth = new Date(now);
        nextMonth.setMonth(now.getMonth() + 1);

        // Calculate subscription expiry (35 days grace = 5 extra days to allow for FLW retry)
        const expiresAt = new Date(now);
        expiresAt.setDate(now.getDate() + 35);

        // Determine if this is a new payment (has transaction ID) or just a status update
        const isNewPayment = Boolean(args.flwTransactionId);

        // Build user update patch
        const userPatch: Record<string, unknown> = {
            tier: args.tier,
            status: args.status,
            // Reset usage on successful payment / new billing cycle
            sopsCreatedThisMonth: 0,
            improvesUsedThisMonth: 0,
            usageResetAt: nextMonth.toISOString(),
            subscriptionExpiresAt: expiresAt.toISOString(),
            ...(isNewPayment && {
                lastPaymentAt: now.toISOString(),
                subscriptionStartedAt: user.subscriptionStartedAt ?? now.toISOString(),
                totalPayments: (user.totalPayments ?? 0) + 1,
            }),
            ...(args.flwCustomerId && { flwCustomerId: args.flwCustomerId }),
            ...(args.flwSubscriptionId && { flwSubscriptionId: args.flwSubscriptionId }),
        };

        await ctx.db.patch(user._id, userPatch);

        // Record payment in payment_history (only if we have transaction details)
        if (args.flwTransactionId && args.flwTxRef) {
            // Idempotency check: skip if this transaction was already recorded
            const existing = await ctx.db
                .query("payment_history")
                .withIndex("by_flw_txn", (q) => q.eq("flwTransactionId", args.flwTransactionId!))
                .first();

            if (!existing) {
                await ctx.db.insert("payment_history", {
                    userId: args.clerkId,
                    flwTransactionId: args.flwTransactionId,
                    flwTxRef: args.flwTxRef,
                    amount: args.amount ?? 0,
                    currency: args.currency ?? "USD",
                    tier: args.tier,
                    event: "charge.completed",
                    status: "successful",
                    timestamp: now.toISOString(),
                });
            }
        }

        // Log subscription change to activity_log
        const tierLabel = args.tier.charAt(0).toUpperCase() + args.tier.slice(1);
        const amountLabel = args.amount ? ` ($${args.amount})` : "";
        await ctx.db.insert("activity_log", {
            userId: args.clerkId,
            action: "subscription_updated",
            details: `Upgraded to ${tierLabel} plan${amountLabel}`,
            timestamp: now.toISOString(),
        });
    },
});

/**
 * Cancel subscription (called from webhook)
 * Downgrades user to free tier and logs the event
 */
export const cancelSubscription = mutation({
    args: {
        webhookSecret: v.string(),
        flwCustomerId: v.string(),
    },
    handler: async (ctx, args) => {
        // Validate webhook secret
        const expectedSecret = process.env.CONVEX_WEBHOOK_SECRET;
        if (!expectedSecret || args.webhookSecret !== expectedSecret) {
            throw new Error("Unauthorized: Invalid webhook secret");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_flw_customer", (q) => q.eq("flwCustomerId", args.flwCustomerId))
            .first();

        if (!user) {
            console.warn(`[Cancel] User not found for FLW Customer ID: ${args.flwCustomerId}`);
            return; // Idempotent — no-op if already removed
        }

        const now = new Date();

        // Downgrade to free
        await ctx.db.patch(user._id, {
            tier: "free",
            status: "canceled",
            flwSubscriptionId: undefined,
            subscriptionExpiresAt: undefined,
        });

        // Record cancellation in payment_history
        await ctx.db.insert("payment_history", {
            userId: user.clerkId,
            flwTransactionId: `cancel_${args.flwCustomerId}_${Date.now()}`,
            flwTxRef: `cancel_${args.flwCustomerId}`,
            amount: 0,
            currency: "USD",
            tier: "free",
            event: "subscription.cancelled",
            status: "cancelled",
            timestamp: now.toISOString(),
        });

        // Log cancellation to activity_log
        await ctx.db.insert("activity_log", {
            userId: user.clerkId,
            action: "subscription_cancelled",
            details: "Subscription cancelled — downgraded to Free plan",
            timestamp: now.toISOString(),
        });
    },
});

/**
 * Check for and expire subscriptions past their expiry date (for cron job)
 * Applies a 3-day grace period beyond subscriptionExpiresAt
 */
export const checkExpiredSubscriptions = internalMutation({
    args: {},
    handler: async (ctx) => {
        const now = new Date();
        // Add 3-day grace period — only expire if >3 days past expiry
        const gracePeriodMs = 3 * 24 * 60 * 60 * 1000;

        // Find all non-free users
        const paidUsers = await ctx.db
            .query("users")
            .filter((q) =>
                q.and(
                    q.neq(q.field("tier"), "free"),
                    q.neq(q.field("subscriptionExpiresAt"), undefined)
                )
            )
            .collect();

        let expiredCount = 0;

        for (const user of paidUsers) {
            if (!user.subscriptionExpiresAt) continue;

            const expiresAt = new Date(user.subscriptionExpiresAt);
            const isExpired = now.getTime() > expiresAt.getTime() + gracePeriodMs;

            if (isExpired) {
                // Downgrade to free
                await ctx.db.patch(user._id, {
                    tier: "free",
                    status: "canceled",
                    flwSubscriptionId: undefined,
                    subscriptionExpiresAt: undefined,
                });

                // Record expiration event
                await ctx.db.insert("payment_history", {
                    userId: user.clerkId,
                    flwTransactionId: `expired_${user.clerkId}_${Date.now()}`,
                    flwTxRef: `expired_${user.clerkId}`,
                    amount: 0,
                    currency: "USD",
                    tier: "free",
                    event: "subscription.expired",
                    status: "cancelled",
                    timestamp: now.toISOString(),
                });

                // Log to activity_log
                await ctx.db.insert("activity_log", {
                    userId: user.clerkId,
                    action: "subscription_expired",
                    details: "Subscription expired — downgraded to Free plan (no renewal received)",
                    timestamp: now.toISOString(),
                });

                expiredCount++;
            }
        }

        return { checked: paidUsers.length, expired: expiredCount };
    },
});

/**
 * Reset monthly usage counters (for cron job)
 */
export const resetMonthlyUsage = internalMutation({
    args: {},
    handler: async (ctx) => {
        const now = new Date();
        const users = await ctx.db.query("users").collect();
        let resetCount = 0;

        for (const user of users) {
            const resetDate = new Date(user.usageResetAt);
            if (now >= resetDate) {
                // Advance reset date month by month until it's in the future
                const nextReset = new Date(resetDate);
                while (now >= nextReset) {
                    nextReset.setMonth(nextReset.getMonth() + 1);
                }

                await ctx.db.patch(user._id, {
                    sopsCreatedThisMonth: 0,
                    improvesUsedThisMonth: 0,
                    usageResetAt: nextReset.toISOString(),
                });
                resetCount++;
            }
        }

        return { checked: users.length, reset: resetCount };
    },
});

// ============================================================================
// DATA MAINTENANCE
// ============================================================================

/**
 * Sync usage counts from existing sessions for the current user only
 */
export const syncUsageFromSessions = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        // Get or create user
        let user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user) {
            const now = new Date();
            const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            const userId = await ctx.db.insert("users", {
                clerkId: identity.subject,
                email: identity.email ?? "unknown@example.com",
                tier: "free",
                status: "active",
                sopsCreatedThisMonth: 0,
                improvesUsedThisMonth: 0,
                usageResetAt: nextMonth.toISOString(),
                totalPayments: 0,
            });
            user = await ctx.db.get(userId);
            if (!user) throw new Error("Failed to create user");
        }

        // Only count THIS user's sessions (fixed from global count)
        const sessions = await ctx.db
            .query("sessions")
            .withIndex("by_user", (q) => q.eq("userId", identity.subject))
            .collect();

        let createCount = 0;
        let improveCount = 0;

        for (const session of sessions) {
            const mode = session.metadata?.mode;
            if (mode === "improve") {
                improveCount++;
            } else {
                createCount++;
            }
        }

        await ctx.db.patch(user._id, {
            sopsCreatedThisMonth: createCount,
            improvesUsedThisMonth: improveCount,
        });

        return { synced: true, createCount, improveCount, userId: user._id };
    },
});

// ============================================================================
// PDF BRANDING (Pro Tier)
// ============================================================================

/**
 * Get watermark settings for the current user
 */
export const getWatermarkSettings = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user) return null;

        return {
            customWatermark: user.customWatermark ?? "",
            watermarkEnabled: user.watermarkEnabled ?? false,
            tier: getActiveTier(user),
        };
    },
});

/**
 * Update watermark settings (Pro tier only)
 */
export const updateWatermarkSettings = mutation({
    args: {
        customWatermark: v.string(),
        watermarkEnabled: v.boolean(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user) throw new Error("User not found");
        if (user.tier !== "pro") throw new Error("Watermark branding is a Pro feature");

        await ctx.db.patch(user._id, {
            customWatermark: args.customWatermark,
            watermarkEnabled: args.watermarkEnabled,
        });
    },
});

// ============================================================================
// HELPERS (Private)
// ============================================================================

/**
 * Get or auto-create a user record — used by increment mutations
 */
const getOrCreateUserForIncrement = async (
    ctx: MutationCtx,
    identity: UserIdentity
) => {
    const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
        .first();

    if (user) return user;

    // Auto-create user if they don't have a record yet
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const userId = await ctx.db.insert("users", {
        clerkId: identity.subject,
        email: identity.email ?? "unknown@example.com",
        tier: "free",
        status: "active",
        sopsCreatedThisMonth: 0,
        improvesUsedThisMonth: 0,
        usageResetAt: nextMonth.toISOString(),
        totalPayments: 0,
    });

    return await ctx.db.get(userId);
};
