import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { auth } from "@clerk/nextjs/server";

// Plan limits (Free, Starter, Pro)
const PLAN_LIMITS = {
    free: { creates: 2, improves: 0 },
    starter: { creates: 12, improves: 5 },
    pro: { creates: Infinity, improves: Infinity },
} as const;

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

        // Create new user with Starter tier
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

        return user;
    },
});

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

        const limit = PLAN_LIMITS[user.tier].creates;
        const remaining = limit === Infinity ? Infinity : limit - user.sopsCreatedThisMonth;

        return {
            canCreate: remaining > 0,
            remaining,
            limit,
            tier: user.tier,
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

        const limit = PLAN_LIMITS[user.tier].improves;
        const remaining = limit === Infinity ? Infinity : limit - user.improvesUsedThisMonth;

        return {
            canImprove: remaining > 0,
            remaining,
            limit,
            tier: user.tier,
        };
    },
});

/**
 * Increment SOP creation count
 */
export const incrementSopCount = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        // Get or create user
        const user = await getOrCreateUserForIncrement(ctx, identity);
        if (!user) {
            throw new Error("Failed to get or create user");
        }

        // Check if month has reset
        const now = new Date();
        const resetDate = new Date(user.usageResetAt);

        if (now >= resetDate) {
            // Reset counts and update reset date
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
 * Increment Improve usage count
 */
export const incrementImproveCount = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        // Get or create user
        const user = await getOrCreateUserForIncrement(ctx, identity);
        if (!user) {
            throw new Error("Failed to get or create user");
        }

        // Check if month has reset
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

/**
 * Update subscription (called from webhook)
 * Uses a secret key for authentication since webhooks don't have user sessions
 */
export const updateSubscription = mutation({
    args: {
        webhookSecret: v.string(), // For authentication
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

        await ctx.db.patch(user._id, {
            tier: args.tier,
            status: args.status,
            ...(args.flwCustomerId && { flwCustomerId: args.flwCustomerId }),
            ...(args.flwSubscriptionId && { flwSubscriptionId: args.flwSubscriptionId }),
        });
    },
});

/**
 * Reset monthly usage (for cron job)
 */
export const resetMonthlyUsage = internalMutation({
    args: {},
    handler: async (ctx) => {
        const now = new Date();
        const users = await ctx.db.query("users").collect();

        for (const user of users) {
            const resetDate = new Date(user.usageResetAt);
            if (now >= resetDate) {
                const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                await ctx.db.patch(user._id, {
                    sopsCreatedThisMonth: 0,
                    improvesUsedThisMonth: 0,
                    usageResetAt: nextMonth.toISOString(),
                });
            }
        }
    },
});

/**
 * Sync usage counts from existing sessions
 * This is a one-time function to populate usage from historical data
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
            // Auto-create user if doesn't exist
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
            });
            user = await ctx.db.get(userId);
            if (!user) throw new Error("Failed to create user");
        }

        // Get all sessions
        const sessions = await ctx.db.query("sessions").collect();

        // Count sessions by mode
        let createCount = 0;
        let improveCount = 0;

        for (const session of sessions) {
            const mode = session.metadata?.mode;
            if (mode === "improve") {
                improveCount++;
            } else {
                // Default to create mode
                createCount++;
            }
        }

        // Update user with counts
        await ctx.db.patch(user._id, {
            sopsCreatedThisMonth: createCount,
            improvesUsedThisMonth: improveCount,
        });

        return {
            synced: true,
            createCount,
            improveCount,
            userId: user._id,
        };
    },
});

/**
 * Helper: Get or auto-create user for increment operations
 */
const getOrCreateUserForIncrement = async (ctx: any, identity: any) => {
    let user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", identity.subject))
        .first();

    if (!user) {
        // Auto-create user
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
        });
        user = await ctx.db.get(userId);
    }

    return user;
};

