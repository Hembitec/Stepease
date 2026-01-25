import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// =============================================================================
// SESSIONS - Active SOP Creation/Improvement Workflows
// =============================================================================

// Get all sessions for the current user
export const list = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        return await ctx.db
            .query("sessions")
            .withIndex("by_user", (q) => q.eq("userId", identity.subject))
            .order("desc")
            .collect();
    },
});

// Get a single session by ID
export const get = query({
    args: { id: v.id("sessions") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Create a new session
export const create = mutation({
    args: {
        title: v.string(),
        phase: v.string(),
        metadata: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        const now = new Date().toISOString();
        return await ctx.db.insert("sessions", {
            userId: identity.subject,
            title: args.title,
            messages: [],
            notes: [],
            phase: args.phase,
            phaseProgress: 0,
            questionsAsked: 0,
            metadata: args.metadata,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Add a message to a session
export const addMessage = mutation({
    args: {
        sessionId: v.id("sessions"),
        role: v.union(v.literal("ai"), v.literal("user")),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const session = await ctx.db.get(args.sessionId);
        if (!session) throw new Error("Session not found");

        const newMessage = {
            role: args.role,
            content: args.content,
            timestamp: new Date().toISOString(),
        };

        await ctx.db.patch(args.sessionId, {
            messages: [...session.messages, newMessage],
            questionsAsked: args.role === "ai" ? session.questionsAsked + 1 : session.questionsAsked,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Add notes to a session
export const addNotes = mutation({
    args: {
        sessionId: v.id("sessions"),
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
    },
    handler: async (ctx, args) => {
        const session = await ctx.db.get(args.sessionId);
        if (!session) throw new Error("Session not found");

        // Get existing note IDs to prevent duplicates
        const existingIds = new Set(session.notes.map(n => n.id));

        // Filter out notes that already exist
        const newNotes = args.notes.filter(n => !existingIds.has(n.id));

        if (newNotes.length > 0) {
            await ctx.db.patch(args.sessionId, {
                notes: [...session.notes, ...newNotes],
                updatedAt: new Date().toISOString(),
            });
        }
    },
});

// Update session phase/progress
export const updateProgress = mutation({
    args: {
        sessionId: v.id("sessions"),
        phase: v.optional(v.string()),
        phaseProgress: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };
        if (args.phase !== undefined) updates.phase = args.phase;
        if (args.phaseProgress !== undefined) updates.phaseProgress = args.phaseProgress;

        await ctx.db.patch(args.sessionId, updates);
    },
});

// Delete a session
export const remove = mutation({
    args: { id: v.id("sessions") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

// Update session title
export const updateTitle = mutation({
    args: {
        sessionId: v.id("sessions"),
        title: v.string(),
    },
    handler: async (ctx, args) => {
        const session = await ctx.db.get(args.sessionId);
        if (!session) throw new Error("Session not found");

        await ctx.db.patch(args.sessionId, {
            title: args.title,
            updatedAt: new Date().toISOString(),
        });
    },
});
