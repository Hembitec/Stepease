import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// =============================================================================
// ACTIVITY LOG — Audit trail for user actions
// =============================================================================

/** Log a user action */
export const log = mutation({
    args: {
        action: v.string(),
        sopId: v.optional(v.string()),
        sopTitle: v.optional(v.string()),
        details: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return;

        await ctx.db.insert("activity_log", {
            userId: identity.subject,
            action: args.action,
            sopId: args.sopId,
            sopTitle: args.sopTitle,
            details: args.details,
            timestamp: new Date().toISOString(),
        });
    },
});

/** Get recent activity for the current user */
export const list = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const limit = args.limit ?? 50;

        const entries = await ctx.db
            .query("activity_log")
            .withIndex("by_user", (q) => q.eq("userId", identity.subject))
            .order("desc")
            .take(limit);

        return entries;
    },
});

/** Get activity for a specific SOP */
export const listBySop = query({
    args: { sopId: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const entries = await ctx.db
            .query("activity_log")
            .withIndex("by_sop", (q) => q.eq("sopId", args.sopId))
            .order("desc")
            .collect();

        // Only return entries belonging to this user
        return entries.filter((e) => e.userId === identity.subject);
    },
});
