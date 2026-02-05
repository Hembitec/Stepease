/**
 * Payment Plan Definitions
 * 
 * Tiers:
 * - Free: 2 SOPs/month, 0 improves, Markdown only
 * - Starter: 12 SOPs/month, 5 improves, All exports (PDF watermarked)
 * - Pro: Unlimited, All exports (clean)
 */
export const PLANS = {
    free: {
        id: null,
        price: 0,
        name: "Free",
        interval: null,
        limits: { creates: 2, improves: 0 },
        exports: ["markdown"],
        features: [
            "2 SOP creations per month",
            "Markdown export only",
            "Basic support",
        ],
    },
    starter: {
        id: process.env.FLW_PLAN_STARTER_ID || null,
        price: 29,
        name: "Starter",
        interval: "monthly" as const,
        limits: { creates: 12, improves: 5 },
        exports: ["markdown", "pdf", "docx", "html"], // PDF is watermarked
        features: [
            "12 SOP creations per month",
            "5 Improve workflows per month",
            "All export formats (PDF watermarked)",
            "Email support",
        ],
    },
    pro: {
        id: process.env.FLW_PLAN_PRO_ID || null,
        price: 79,
        name: "Pro",
        interval: "monthly" as const,
        limits: { creates: Infinity, improves: Infinity },
        exports: ["markdown", "pdf", "docx", "html"], // All clean
        features: [
            "Unlimited SOP creations",
            "Unlimited Improve workflows",
            "All export formats (clean PDF)",
            "Priority support",
            "Version history",
        ],
    },
} as const;

export type PlanId = keyof typeof PLANS;

/**
 * Get plan by price amount (for webhook processing)
 */
export function getPlanByAmount(amount: number): PlanId {
    if (amount === 79) return "pro";
    if (amount === 29) return "starter";
    return "free";
}
