import { flwRequest } from "./auth";
import { PLANS, PlanId } from "./plans";
import { flwConfig } from "./config";

interface CheckoutParams {
    planId: PlanId;
    customerEmail: string;
    customerId: string;
    redirectUrl: string;
}

interface CheckoutResponse {
    status: string;
    message: string;
    data: {
        link: string;
    };
}

/**
 * Create a hosted checkout session for subscription
 */
export async function createCheckoutSession(
    params: CheckoutParams
): Promise<string> {
    const plan = PLANS[params.planId];

    if (!plan || plan.price === 0) {
        throw new Error("Cannot create checkout for free plan");
    }

    const txRef = `sub_${params.customerId}_${Date.now()}`;

    const response = await flwRequest<CheckoutResponse>("/payments", {
        method: "POST",
        body: JSON.stringify({
            tx_ref: txRef,
            amount: plan.price,
            currency: "USD",
            redirect_url: params.redirectUrl,
            payment_options: "card", // Card only
            customer: {
                email: params.customerEmail,
            },
            payment_plan: plan.id,
            customizations: {
                title: "StepEase Subscription",
                description: `${plan.name} Plan - $${plan.price}/month`,
                logo: `${process.env.NEXT_PUBLIC_APP_URL}/icon.png`,
            },
        }),
    });

    if (response.status !== "success") {
        throw new Error(`Checkout creation failed: ${response.message}`);
    }

    return response.data.link;
}
