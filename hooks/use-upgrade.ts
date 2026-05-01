"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { upgradeSubscription } from "@/app/actions/payment"
import { toast } from "sonner"

type PaidPlanKey = "starter" | "pro"

/**
 * Shared hook for the subscription upgrade flow.
 *
 * Used by:
 * - components/pricing/upgrade-modal.tsx
 * - components/settings/settings-plans-panel.tsx
 *
 * Handles: email resolution, calling the server action,
 * redirecting to Flutterwave checkout, and error feedback.
 */
export function useUpgrade() {
    const [loading, setLoading] = useState<PaidPlanKey | null>(null)
    const { user } = useUser()

    const handleUpgrade = async (planKey: PaidPlanKey) => {
        try {
            setLoading(planKey)

            const email = user?.emailAddresses[0]?.emailAddress
            if (!email) {
                toast.error("Could not find your email address. Please try again.")
                setLoading(null)
                return
            }

            const checkoutUrl = await upgradeSubscription(planKey, email)

            // Redirect to Flutterwave hosted checkout
            window.location.href = checkoutUrl
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Failed to start upgrade"
            toast.error(message)
            setLoading(null)
        }
    }

    return { loading, handleUpgrade }
}
