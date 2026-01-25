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
