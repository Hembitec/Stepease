import { NextRequest, NextResponse } from "next/server";
import {
    verifyWebhookSignature,
    parseWebhookPayload,
    verifyTransaction,
    getPlanByAmount
} from "@/lib/flutterwave";
import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";

/**
 * Flutterwave Webhook Handler
 * 
 * Security measures:
 * 1. HMAC-SHA256 signature verification
 * 2. Transaction re-verification via API
 * 3. Idempotent processing
 */
export async function POST(req: NextRequest) {
    try {
        // 1. Get raw body for signature verification
        const rawBody = await req.text();
        const signature = req.headers.get("flutterwave-signature");

        // 2. Verify webhook signature
        if (!verifyWebhookSignature(rawBody, signature)) {
            console.error("[Webhook] Invalid signature");
            return NextResponse.json(
                { error: "Invalid signature" },
                { status: 401 }
            );
        }

        // 3. Parse payload
        const payload = parseWebhookPayload(rawBody);
        console.log("[Webhook] Event received:", payload.event);

        // 4. Only process successful charge events
        if (payload.event !== "charge.completed") {
            return NextResponse.json({ status: "ignored" });
        }

        // 5. Re-verify transaction with Flutterwave API
        const verification = await verifyTransaction(payload.data.id);

        if (verification.data.status !== "successful") {
            console.error("[Webhook] Transaction not successful:", verification.data.status);
            return NextResponse.json(
                { error: "Transaction not successful" },
                { status: 400 }
            );
        }

        // 6. Extract user ID from tx_ref (format: sub_<clerkId>_<timestamp>)
        const txRef = verification.data.tx_ref;
        const clerkId = txRef.split("_")[1];

        if (!clerkId) {
            console.error("[Webhook] Invalid tx_ref format:", txRef);
            return NextResponse.json(
                { error: "Invalid transaction reference" },
                { status: 400 }
            );
        }

        // 7. Determine tier from amount
        const tier = getPlanByAmount(verification.data.amount);

        // 8. Update user subscription in Convex
        const webhookSecret = process.env.CONVEX_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new Error("CONVEX_WEBHOOK_SECRET not configured");
        }

        await fetchMutation(api.users.updateSubscription, {
            webhookSecret,
            clerkId,
            tier,
            status: "active",
            flwCustomerId: String(verification.data.customer.id),
            flwSubscriptionId: String(verification.data.id),
        });

        console.log("[Webhook] Subscription updated:", { clerkId, tier });

        return NextResponse.json({ status: "ok" });
    } catch (error) {
        console.error("[Webhook] Error processing webhook:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// Disable body parsing for raw body access
export const config = {
    api: {
        bodyParser: false,
    },
};
