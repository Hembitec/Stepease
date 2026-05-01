"use server";

import { auth } from "@clerk/nextjs/server";
import { createCheckoutSession } from "@/lib/flutterwave";
import type { PlanId } from "@/lib/flutterwave";

/**
 * Initiate upgrade to a paid plan
 * Returns the Flutterwave checkout URL
 *
 * Note: We pass email from the client to avoid calling currentUser()
 * which can fail with ClerkAPIResponseError in server actions.
 */
export async function upgradeSubscription(
    tier: PlanId,
    email: string
): Promise<string> {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    if (!email) {
        throw new Error("No email address provided");
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
        throw new Error("NEXT_PUBLIC_APP_URL not configured");
    }

    const checkoutUrl = await createCheckoutSession({
        planId: tier,
        customerEmail: email,
        customerId: userId,
        redirectUrl: `${appUrl}/dashboard?payment=success`,
    });

    return checkoutUrl;
}


/**
 * Cancel the current subscription
 * Email is passed from the client to avoid calling currentUser()
 */
export async function cancelSubscriptionAction(email: string): Promise<{
    success: boolean;
    message: string;
}> {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        if (!email) throw new Error("No email provided");

        const { flwRequest } = await import("@/lib/flutterwave");

        // Get subscriptions for this user
        const response = await flwRequest<{ data: { id: number; status: string }[] }>(
            `/subscriptions?email=${email}`
        );

        const activeSub = response.data?.find(s => s.status === "active");

        if (!activeSub) {
            return { success: false, message: "No active subscription found to cancel." };
        }

        // Cancel it
        await flwRequest(`/subscriptions/${activeSub.id}/cancel`, {
            method: "PUT",
        });

        return { success: true, message: "Subscription cancelled successfully." };

    } catch (error) {
        console.error("Cancel error:", error);
        return { success: false, message: "Failed to cancel subscription. Please try again." };
    }
}
