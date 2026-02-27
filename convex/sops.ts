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
        version: v.optional(v.number()),       // Version number (1, 2, 3...)
        parentSopId: v.optional(v.string()),    // Root SOP ID for version grouping
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
        const sopId = await ctx.db.insert("sops", {
            userId: identity.subject,
            title: args.title,
            department: args.department,
            status: args.status,
            content: args.content,
            sessionId: args.sessionId,
            version: args.version ?? 1,
            parentSopId: args.parentSopId,
            notes: args.notes,
            chatHistory: args.chatHistory,
            createdAt: now,
            updatedAt: now,
        });

        // Log activity
        await ctx.db.insert("activity_log", {
            userId: identity.subject,
            action: "created",
            sopId: String(sopId),
            sopTitle: args.title,
            details: args.version && args.version > 1
                ? `Created version ${args.version}`
                : "Created new SOP",
            timestamp: now,
        });

        return sopId;
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
        const identity = await ctx.auth.getUserIdentity();
        const { id, ...updates } = args;
        const filteredUpdates = Object.fromEntries(
            Object.entries(updates).filter(([, value]) => value !== undefined)
        );

        await ctx.db.patch(id, {
            ...filteredUpdates,
            updatedAt: new Date().toISOString(),
        });

        // Log status changes (archive/unarchive)
        if (identity && args.status) {
            const sop = await ctx.db.get(id);
            const action = args.status === "archived" ? "archived" : args.status === "complete" ? "approved" : undefined;
            if (action && sop) {
                await ctx.db.insert("activity_log", {
                    userId: identity.subject,
                    action,
                    sopId: String(id),
                    sopTitle: sop.title,
                    details: args.status === "archived" ? "Archived SOP" : "Restored SOP",
                    timestamp: new Date().toISOString(),
                });
            }
        }
    },
});

// Get version history for a specific SOP (all versions sharing the same parent)
export const getVersionHistory = query({
    args: { sopId: v.id("sops") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        // First, get the SOP to find its parentSopId (or use its own ID if it's the root)
        const sop = await ctx.db.get(args.sopId);
        if (!sop) return [];

        const rootId = sop.parentSopId || String(sop._id);

        // Get all versions: the root itself + all children pointing to the root
        const children = await ctx.db
            .query("sops")
            .withIndex("by_parent", (q) => q.eq("parentSopId", rootId))
            .collect();

        // Also include the root if it's not already in children
        const rootInChildren = children.some(c => String(c._id) === rootId);
        let allVersions = rootInChildren ? children : [];

        if (!rootInChildren) {
            const root = await ctx.db.get(args.sopId);
            if (root && root.parentSopId === undefined) {
                // This is the root SOP, include it
                allVersions = [root, ...children];
            } else {
                allVersions = children;
            }
        }

        // Sort by version descending (latest first)
        return allVersions
            .filter(s => s.userId === identity.subject)
            .sort((a, b) => (b.version ?? 1) - (a.version ?? 1));
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

// =============================================================================
// Sharing — Public read-only links
// =============================================================================

/** Generate a unique share token for an SOP */
export const generateShareToken = mutation({
    args: { id: v.id("sops") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        const sop = await ctx.db.get(args.id);
        if (!sop) throw new Error("SOP not found");
        if (sop.userId !== identity.subject) throw new Error("Not authorized");

        // If already has a token, return it
        if (sop.shareToken) return sop.shareToken;

        // Generate a random 12-char alphanumeric token
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let token = "";
        for (let i = 0; i < 12; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        await ctx.db.patch(args.id, { shareToken: token });

        // Log activity
        await ctx.db.insert("activity_log", {
            userId: identity.subject,
            action: "shared",
            sopId: String(args.id),
            sopTitle: sop.title,
            details: "Generated share link",
            timestamp: new Date().toISOString(),
        });

        return token;
    },
});

/** Revoke (remove) the share token */
export const revokeShareToken = mutation({
    args: { id: v.id("sops") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        const sop = await ctx.db.get(args.id);
        if (!sop) throw new Error("SOP not found");
        if (sop.userId !== identity.subject) throw new Error("Not authorized");

        await ctx.db.patch(args.id, { shareToken: undefined });

        // Log activity
        await ctx.db.insert("activity_log", {
            userId: identity.subject,
            action: "shared",
            sopId: String(args.id),
            sopTitle: sop.title,
            details: "Revoked share link",
            timestamp: new Date().toISOString(),
        });
    },
});

/** Public query — fetch an SOP by its share token (no auth required) */
export const getByShareToken = query({
    args: { token: v.string() },
    handler: async (ctx, args) => {
        const sop = await ctx.db
            .query("sops")
            .withIndex("by_share_token", (q) => q.eq("shareToken", args.token))
            .first();

        if (!sop) return null;

        // Return only safe, public-facing fields
        return {
            title: sop.title,
            department: sop.department,
            content: sop.content,
            updatedAt: sop.updatedAt,
            createdAt: sop.createdAt,
            version: sop.version,
        };
    },
});
