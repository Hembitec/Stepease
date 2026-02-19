import { flwConfig } from "./config";
import { PLANS, type PlanId } from "./plans";

/**
 * Create a Flutterwave hosted checkout session
 * Returns the checkout URL to redirect the user to
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

    // Generate unique transaction reference
    const txRef = `sub_${params.customerId}_${Date.now()}`;

    const payload = {
        tx_ref: txRef,
        amount: plan.price,
        currency: "USD",
        redirect_url: params.redirectUrl,
        payment_options: "card,ussd,banktransfer",
        customer: {
            email: params.customerEmail,
            name: params.customerEmail.split("@")[0],
        },
        customizations: {
            title: `${plan.name} Plan Subscription`,
            description: `Monthly subscription to StepEase ${plan.name} plan`,
            logo: "https://ease.070351.xyz/logo.png",
        },
        meta: {
            plan_id: params.planId,
            customer_id: params.customerId,
        },
    };

    const response = await fetch(`${flwConfig.baseUrl}/payments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${flwConfig.secretKey}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to create checkout: ${error}`);
    }

    const data = await response.json();
    return data.data.link;
}
