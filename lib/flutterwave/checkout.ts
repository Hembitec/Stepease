import { flwRequest } from "./auth";
import { flwConfig } from "./config";
import { PLANS, type PlanId } from "./plans";

interface CheckoutResponse {
    status: string;
    message: string;
    data: {
        link: string;
    };
}

/**
 * Create a Flutterwave hosted checkout session with recurring subscription support.
 *
 * By including `payment_plan` in the payload, Flutterwave will:
 * 1. Tokenize the customer's card on first payment
 * 2. Automatically charge the card each billing cycle (monthly)
 * 3. Send a `charge.completed` webhook on each successful renewal
 * 4. Send a `subscription.cancelled` webhook if the plan is cancelled
 *
 * NOTE: `payment_options` is restricted to "card" because Flutterwave
 * only supports card tokenization for recurring subscriptions.
 *
 * SETUP REQUIRED: Create Payment Plans in your Flutterwave Dashboard at
 * https://dashboard.flutterwave.com/dashboard/subscriptions/create-plan
 * and set FLW_PLAN_STARTER_ID and FLW_PLAN_PRO_ID in your environment.
 */
export async function createCheckoutSession(params: {
    planId: PlanId;
    customerEmail: string;
    customerId: string;
    redirectUrl: string;
}): Promise<string> {
    const plan = PLANS[params.planId];

    if (!plan || plan.price === 0) {
        throw new Error("Invalid plan for checkout");
    }

    // Get the Flutterwave Payment Plan ID for recurring billing
    const flwPlanId = flwConfig.planIds[params.planId as "starter" | "pro"];

    if (!flwPlanId) {
        throw new Error(
            `No Flutterwave Payment Plan configured for "${params.planId}". ` +
            `Set FLW_PLAN_${params.planId.toUpperCase()}_ID in your environment variables. ` +
            `Create payment plans at: https://dashboard.flutterwave.com/dashboard/subscriptions`
        );
    }

    // Generate unique transaction reference for this checkout session
    // Format: sub_<clerkId>_<timestamp> — used by webhook to identify the user
    const txRef = `sub_${params.customerId}_${Date.now()}`;

    const payload = {
        tx_ref: txRef,
        amount: plan.price,
        currency: "USD",
        redirect_url: params.redirectUrl,
        // Card only — required for Flutterwave subscription tokenization
        payment_options: "card",
        // The Flutterwave Payment Plan ID — this is what makes it recurring
        payment_plan: flwPlanId,
        customer: {
            email: params.customerEmail,
            name: params.customerEmail.split("@")[0],
        },
        customizations: {
            title: `${plan.name} Plan — StepEase`,
            description: `Monthly subscription to StepEase ${plan.name} plan`,
            logo: "https://ease.070351.xyz/logo.png",
        },
        meta: {
            plan_id: params.planId,
            customer_id: params.customerId,
        },
    };

    const data = await flwRequest<CheckoutResponse>("/payments", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (data.status !== "success" || !data.data?.link) {
        throw new Error(`Failed to create checkout session: ${data.message}`);
    }

    return data.data.link;
}
