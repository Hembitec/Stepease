import { mutation } from "./_generated/server";

// =============================================================================
// MIGRATIONS - One-time data fixes and backfills
// =============================================================================

/**
 * Backfill titles for existing SOPs and sessions.
 * 
 * Strategy:
 * 1. For SOPs: Extract title from markdown content (first # heading)
 * 2. For sessions WITH linked SOP: Copy the SOP's good title to the session
 * 3. For sessions WITHOUT linked SOP: Clean up long descriptions
 * 
 * Run with: npx convex run migrations:backfillTitles
 */
export const backfillTitles = mutation({
    args: {},
    handler: async (ctx) => {
        const sops = await ctx.db.query("sops").collect();
        const sessions = await ctx.db.query("sessions").collect();
        let updatedSops = 0;
        let updatedSessions = 0;

        // STEP 1: Fix SOPs with generic titles (extract from markdown content)
        for (const sop of sops) {
            const genericTitles = ["New SOP", "SOP Improvement", "New SOP Draft"];
            if (genericTitles.includes(sop.title)) {
                // Extract title from content (first # heading)
                const match = sop.content?.match(/^#\s+(.+)$/m);
                if (match) {
                    const extractedTitle = match[1].trim();
                    await ctx.db.patch(sop._id, {
                        title: extractedTitle,
                        updatedAt: new Date().toISOString()
                    });
                    updatedSops++;
                }
            }
        }

        // Refresh SOPs after updates
        const updatedSopsList = await ctx.db.query("sops").collect();

        // STEP 2: Fix sessions by syncing from linked SOPs OR cleaning up long titles
        for (const session of sessions) {
            let newTitle: string | null = null;

            // Check if this session has a linked SOP (look for SOPs with this sessionId)
            const linkedSop = updatedSopsList.find(sop => sop.sessionId === session._id);

            if (linkedSop && linkedSop.title) {
                // Use the SOP's title (it should be good now)
                newTitle = linkedSop.title;
            } else {
                // No linked SOP - check if current title is too long or generic
                const genericTitles = ["New SOP", "SOP Improvement", "New SOP Draft"];
                const isTooLong = session.title.length > 60;
                const isGeneric = genericTitles.includes(session.title);
                const isDescription = session.title.toLowerCase().startsWith("the sop will");

                if (isGeneric || isTooLong || isDescription) {
                    // Try to extract a better title from notes
                    const headerNote = session.notes?.find((n: any) => n.category === "HEADER_INFO");

                    if (headerNote?.content) {
                        // Look for actual title mentions in the note
                        const titleMatch = headerNote.content.match(/title[:\s]+["']?([^"'\n.]+)/i);
                        if (titleMatch) {
                            newTitle = titleMatch[1].trim();
                        } else {
                            // Extract key topic from the description
                            // "The SOP will cover the process of arranging and organizing items"
                            // -> "Item Organization Process"
                            const topicMatch = headerNote.content.match(/process of\s+(.+?)(?:\s+for|\s+in|\s+to|$)/i);
                            if (topicMatch) {
                                const topic = topicMatch[1].trim();
                                // Capitalize and shorten
                                const words = topic.split(/\s+/).slice(0, 4);
                                newTitle = words.map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") + " Procedure";
                            }
                        }
                    }

                    // Fallback: Just truncate if still too long
                    if (!newTitle && isTooLong) {
                        newTitle = session.title.substring(0, 50) + "...";
                    }
                }
            }

            // Apply the new title if we found one
            if (newTitle && newTitle !== session.title) {
                await ctx.db.patch(session._id, {
                    title: newTitle,
                    updatedAt: new Date().toISOString()
                });
                updatedSessions++;
            }
        }

        return {
            updatedSops,
            updatedSessions,
            totalSops: sops.length,
            totalSessions: sessions.length
        };
    },
});

/**
 * Fix stale user data — one-time migration for existing users.
 *
 * Issues fixed:
 * 1. usageResetAt dates 1-2 months in the past (usage never reset)
 * 2. Free-tier user with 9 SOPs + 3 improves (exceeds limits)
 * 3. Paying users missing subscriptionExpiresAt, totalPayments, lastPaymentAt
 *
 * Run with: npx convex run migrations:fixStaleUserData
 */
export const fixStaleUserData = mutation({
    args: {},
    handler: async (ctx) => {
        const now = new Date();
        const users = await ctx.db.query("users").collect();
        const report: Record<string, string[]> = {};

        for (const user of users) {
            const changes: string[] = [];

            // Fix 1: Advance stale usageResetAt to next valid future date
            const resetDate = new Date(user.usageResetAt);
            if (now >= resetDate) {
                const newReset = new Date(resetDate);
                while (now >= newReset) {
                    newReset.setMonth(newReset.getMonth() + 1);
                }
                await ctx.db.patch(user._id, { usageResetAt: newReset.toISOString() });
                changes.push(
                    `usageResetAt: ${resetDate.toISOString().split("T")[0]} → ${newReset.toISOString().split("T")[0]}`
                );
            }

            // Fix 2: Clear corrupted usage for free-tier users over limits
            if (user.tier === "free") {
                const hasExcessCreates = user.sopsCreatedThisMonth > 2;
                const hasExcessImproves = user.improvesUsedThisMonth > 0;
                if (hasExcessCreates || hasExcessImproves) {
                    await ctx.db.patch(user._id, {
                        sopsCreatedThisMonth: 0,
                        improvesUsedThisMonth: 0,
                    });
                    changes.push(
                        `Reset corrupted usage — creates: ${user.sopsCreatedThisMonth}→0, improves: ${user.improvesUsedThisMonth}→0`
                    );
                }
            }

            // Fix 3: Backfill subscription fields for existing paying users
            if (user.tier !== "free" && user.flwCustomerId) {
                const patch: Record<string, unknown> = {};

                if (!user.totalPayments) {
                    patch.totalPayments = 1;
                    changes.push("totalPayments: null → 1");
                }
                if (!user.lastPaymentAt) {
                    patch.lastPaymentAt = "2026-03-01T00:00:00.000Z";
                    changes.push("lastPaymentAt: null → 2026-03-01 (estimated)");
                }
                if (!user.subscriptionStartedAt) {
                    patch.subscriptionStartedAt = "2026-03-01T00:00:00.000Z";
                    changes.push("subscriptionStartedAt: null → 2026-03-01 (estimated)");
                }
                if (!user.subscriptionExpiresAt) {
                    // Expire in 48h — forces re-subscription to test the new renewal flow
                    const expiresAt = new Date(now);
                    expiresAt.setHours(now.getHours() + 48);
                    patch.subscriptionExpiresAt = expiresAt.toISOString();
                    changes.push(`subscriptionExpiresAt: null → ${expiresAt.toISOString().split("T")[0]} (48h from now)`);
                }

                if (Object.keys(patch).length > 0) {
                    await ctx.db.patch(user._id, patch);
                }
            }

            if (changes.length > 0) {
                report[user.email] = changes;
            }
        }

        return {
            message: "Migration complete",
            usersModified: Object.keys(report).length,
            totalUsers: users.length,
            details: report,
        };
    },
});
