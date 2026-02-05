import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Shared shapes
const noteShape = v.object({
    id: v.string(),
    category: v.string(), // We keep as string to match enum but store simply
    priority: v.string(),
    content: v.string(),
    relatedTo: v.string(),
    action: v.string(),
    timestamp: v.string(),
    source: v.string(),
});

const chatMessageShape = v.object({
    role: v.union(v.literal("ai"), v.literal("user")),
    content: v.string(),
    timestamp: v.string(),
});

export default defineSchema({
    // Table for user subscriptions and usage tracking
    users: defineTable({
        // Identity (linked to Clerk)
        clerkId: v.string(),
        email: v.string(),

        // Subscription (free, starter, pro)
        tier: v.union(v.literal("free"), v.literal("starter"), v.literal("pro")),
        status: v.union(
            v.literal("active"),
            v.literal("past_due"),
            v.literal("canceled"),
            v.literal("unpaid")
        ),

        // Flutterwave Integration
        flwCustomerId: v.optional(v.string()),
        flwSubscriptionId: v.optional(v.string()),

        // Usage Tracking (for free tier limits)
        sopsCreatedThisMonth: v.number(),
        improvesUsedThisMonth: v.number(),
        usageResetAt: v.string(), // ISO date for monthly reset
    })
        .index("by_clerk_id", ["clerkId"])
        .index("by_flw_customer", ["flwCustomerId"]),

    // Table for Finalized/Saved SOPs
    sops: defineTable({
        userId: v.string(),
        title: v.string(),
        department: v.optional(v.string()),
        status: v.string(), // 'draft', 'complete', 'archived'
        content: v.string(), // Markdown content
        notes: v.array(noteShape),
        chatHistory: v.array(chatMessageShape),
        sessionId: v.optional(v.string()), // Link back to original session for draft SOPs
        updatedAt: v.string(),
        createdAt: v.string(),
    }).index("by_user", ["userId"]),

    // Table for Active Sessions (Drafts / AI Workflows)
    sessions: defineTable({
        userId: v.string(),
        title: v.string(),
        messages: v.array(chatMessageShape),
        notes: v.array(noteShape),
        phase: v.string(),
        phaseProgress: v.number(),
        questionsAsked: v.number(),
        metadata: v.optional(v.any()), // Context, analysis results etc.

        // Session lifecycle (for archive-instead-of-delete flow)
        status: v.optional(v.union(v.literal("active"), v.literal("approved"))),
        approvedAt: v.optional(v.string()),  // ISO date when first approved
        revisionCount: v.optional(v.number()), // How many times revised after approval

        updatedAt: v.string(),
        createdAt: v.string(),
    }).index("by_user", ["userId"]),
});
