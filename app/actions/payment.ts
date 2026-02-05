"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { createCheckoutSession } from "@/lib/flutterwave";
import type { PlanId } from "@/lib/flutterwave";

/**
 * Initiate upgrade to a paid plan
 * Returns the Flutterwave checkout URL
 */
export async function upgradeSubscription(tier: PlanId): Promise<string> {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        throw new Error("Unauthorized");
    }

    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) {
        throw new Error("No email address found");
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
 * Handle successful payment redirect
 * This is called when user returns from Flutterwave
 */
export async function handlePaymentSuccess(): Promise<{
    success: boolean;
    message: string;
}> {
    const { userId } = await auth();

    if (!userId) {
        return { success: false, message: "Not authenticated" };
    }

    // The webhook will have already updated the subscription
    // This action just confirms the return
    return {
        success: true,
        message: "Your subscription has been upgraded! Enjoy unlimited access.",
    };
}
