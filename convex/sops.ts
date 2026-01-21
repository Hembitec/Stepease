import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// =============================================================================
// SOPS - Finalized/Saved Standard Operating Procedures
// =============================================================================

// Get all SOPs for the current user
export const list = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        return await ctx.db
            .query("sops")
            .withIndex("by_user", (q) => q.eq("userId", identity.subject))
            .order("desc")
            .collect();
    },
});

// Get a single SOP by ID
export const get = query({
    args: { id: v.id("sops") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Create a new SOP (typically from finalizing a session)
export const create = mutation({
    args: {
        title: v.string(),
        department: v.optional(v.string()),
        status: v.string(),
        content: v.string(),
        sessionId: v.optional(v.string()), // Link back to original session
        notes: v.array(v.object({
            id: v.string(),
            category: v.string(),
            priority: v.string(),
            content: v.string(),
            relatedTo: v.string(),
            action: v.string(),
            timestamp: v.string(),
            source: v.string(),
        })),
        chatHistory: v.array(v.object({
            role: v.union(v.literal("ai"), v.literal("user")),
            content: v.string(),
            timestamp: v.string(),
        })),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        const now = new Date().toISOString();
        return await ctx.db.insert("sops", {
            userId: identity.subject,
            title: args.title,
            department: args.department,
            status: args.status,
            content: args.content,
            sessionId: args.sessionId,
            notes: args.notes,
            chatHistory: args.chatHistory,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Update an existing SOP
export const update = mutation({
    args: {
        id: v.id("sops"),
        title: v.optional(v.string()),
        department: v.optional(v.string()),
        status: v.optional(v.string()),
        content: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        const filteredUpdates = Object.fromEntries(
            Object.entries(updates).filter(([, value]) => value !== undefined)
        );

        await ctx.db.patch(id, {
            ...filteredUpdates,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Delete an SOP (archive)
export const remove = mutation({
    args: { id: v.id("sops") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

// Add a note to an existing SOP
export const addNote = mutation({
    args: {
        sopId: v.id("sops"),
        note: v.object({
            id: v.string(),
            category: v.string(),
            priority: v.string(),
            content: v.string(),
            relatedTo: v.string(),
            action: v.string(),
            timestamp: v.string(),
            source: v.string(),
        }),
    },
    handler: async (ctx, args) => {
        const sop = await ctx.db.get(args.sopId);
        if (!sop) throw new Error("SOP not found");

        await ctx.db.patch(args.sopId, {
            notes: [...sop.notes, args.note],
            updatedAt: new Date().toISOString(),
        });
    },
});

// Add a chat message to an existing SOP
export const addMessage = mutation({
    args: {
        sopId: v.id("sops"),
        role: v.union(v.literal("ai"), v.literal("user")),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const sop = await ctx.db.get(args.sopId);
        if (!sop) throw new Error("SOP not found");

        const newMessage = {
            role: args.role,
            content: args.content,
            timestamp: new Date().toISOString(),
        };

        await ctx.db.patch(args.sopId, {
            chatHistory: [...sop.chatHistory, newMessage],
            updatedAt: new Date().toISOString(),
        });
    },
});
