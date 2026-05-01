export const PLAN_LIMITS = {
    free: { creates: 2, improves: 0 },
    starter: { creates: 12, improves: 5 },
    pro: { creates: Infinity, improves: Infinity },
} as const;
