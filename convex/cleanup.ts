import { v } from "convex/values";
import { mutation } from "./_generated/server";

// One-time cleanup mutation to remove duplicate notes from sessions
export const cleanupDuplicateNotes = mutation({
    args: {},
    handler: async (ctx) => {
        // Get ALL sessions (one-time cleanup, no auth needed)
        const sessions = await ctx.db.query("sessions").collect();

        let totalCleaned = 0;

        for (const session of sessions) {
            if (!session.notes || session.notes.length === 0) continue;

            // Deduplicate notes by ID
            const seen = new Set<string>();
            const uniqueNotes = session.notes.filter(note => {
                if (seen.has(note.id)) {
                    return false;
                }
                seen.add(note.id);
                return true;
            });

            // Only update if there were duplicates
            if (uniqueNotes.length < session.notes.length) {
                await ctx.db.patch(session._id, {
                    notes: uniqueNotes,
                    updatedAt: new Date().toISOString(),
                });
                totalCleaned += session.notes.length - uniqueNotes.length;
            }
        }

        return { cleaned: totalCleaned };
    },
});
