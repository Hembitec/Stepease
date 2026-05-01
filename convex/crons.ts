import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

/**
 * Scheduled Cron Jobs for StepEase
 *
 * - resetMonthlyUsage: Runs daily at midnight UTC.
 *   Resets sopsCreatedThisMonth and improvesUsedThisMonth for any user
 *   whose usageResetAt date has passed.
 *
 * - checkExpiredSubscriptions: Runs every 6 hours.
 *   Downgrades paid users to free if their subscriptionExpiresAt has
 *   passed the 3-day grace period with no renewal webhook received.
 */
const crons = cronJobs();

// Reset usage counters daily at 00:00 UTC
crons.cron(
    "reset monthly usage",
    "0 0 * * *",
    internal.users.resetMonthlyUsage,
    {}
);

// Check for expired subscriptions every 6 hours
crons.cron(
    "check expired subscriptions",
    "0 */6 * * *",
    internal.users.checkExpiredSubscriptions,
    {}
);

export default crons;
