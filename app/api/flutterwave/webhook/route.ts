import { NextRequest, NextResponse } from "next/server";
import {
    verifyWebhookSignature,
    verifyTransaction,
    getPlanByAmount
} from "@/lib/flutterwave";
import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";

/**
 * Flutterwave Webhook Handler
 *
 * ACTUAL Flutterwave payload structure (discovered via testing):
 * The payload is FLAT — no event/data wrapper:
 * {
 *   id: 10017759,
 *   txRef: "sub_user_xxx_timestamp",    // camelCase, not tx_ref
 *   status: "successful",
 *   amount: 29,
 *   customer: { id: 3468076, email: "..." },
 *   "event.type": "CARD_TRANSACTION"    // dotted key, not nested
 * }
 *
 * The verify API response IS wrapped: { data: { id, tx_ref, status, ... } }
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface FlwWebhookPayload {
    id: number;
    txRef?: string;
    tx_ref?: string;
    flwRef?: string;
    status: string;
    amount: number;
    charged_amount?: number;
    currency?: string;
    customer: {
        id: number;
        email: string;
        fullName?: string;
        phone?: string | null;
    };
    "event.type"?: string;
    // Some webhook events use nested structure
    event?: string;
    data?: {
        id: number;
        status: string;
        tx_ref?: string;
        amount?: number;
        customer: {
            id: number;
            email: string;
        };
    };
}

export async function POST(req: NextRequest) {
    try {
        // 1. Get raw body for signature verification
        const rawBody = await req.text();

        // 2. Verify webhook via verif-hash header
        const verifHash = req.headers.get("verif-hash");
        console.log("[Webhook] Request received. verif-hash:", verifHash ? "present" : "missing");

        if (!verifyWebhookSignature(verifHash)) {
            console.error("[Webhook] Signature verification failed");
            return NextResponse.json(
                { error: "Invalid signature" },
                { status: 401 }
            );
        }

        console.log("[Webhook] Signature verified ✓");

        // 3. Parse payload
        const payload: FlwWebhookPayload = JSON.parse(rawBody);

        // Determine the transaction ID and txRef
        // Flutterwave can send flat OR nested payloads depending on event type
        const txnId = payload.data?.id ?? payload.id;
        const txRef = payload.data?.tx_ref ?? payload.txRef ?? payload.tx_ref ?? "";
        const status = payload.data?.status ?? payload.status;
        const amount = payload.data?.amount ?? payload.amount;
        const customerId = payload.data?.customer?.id ?? payload.customer?.id;
        const eventType = payload.event ?? payload["event.type"] ?? "unknown";

        console.log("[Webhook] Event:", eventType);
        console.log("[Webhook] Transaction:", { txnId, txRef, status, amount });

        // 4. Handle cancellation events
        if (
            eventType === "subscription.cancelled" ||
            eventType === "SUBSCRIPTION_CANCELLED"
        ) {
            const email = payload.data?.customer?.email ?? payload.customer?.email;
            if (!email) {
                return NextResponse.json(
                    { error: "No email in cancellation payload" },
                    { status: 400 }
                );
            }

            console.log("[Webhook] Processing cancellation for:", email);

            const webhookSecret = process.env.CONVEX_WEBHOOK_SECRET;
            if (!webhookSecret) throw new Error("CONVEX_WEBHOOK_SECRET not configured");

            const flwCustomerId = String(customerId);

            await fetchMutation(api.users.cancelSubscription, {
                webhookSecret,
                flwCustomerId,
            });

            console.log("[Webhook] Subscription cancelled for customer:", flwCustomerId);
            return NextResponse.json({ status: "ok" });
        }

        // 5. Only process successful transactions
        if (status !== "successful") {
            console.log("[Webhook] Ignoring non-successful status:", status);
            return NextResponse.json({ status: "ignored" });
        }

        // 6. Re-verify transaction with Flutterwave API (critical security step)
        console.log("[Webhook] Re-verifying transaction:", txnId);
        const verification = await verifyTransaction(txnId);

        if (verification.data.status !== "successful") {
            console.error("[Webhook] Verification failed:", verification.data.status);
            return NextResponse.json(
                { error: "Transaction not successful" },
                { status: 400 }
            );
        }

        // 7. Extract user ID from tx_ref
        // Format: sub_user_xxxxx_timestamp → we need "user_xxxxx"
        const verifiedTxRef = verification.data.tx_ref || txRef;
        const parts = verifiedTxRef.split("_");
        // Skip "sub_" prefix and "_timestamp" suffix
        const clerkId = parts.slice(1, -1).join("_");

        if (!clerkId) {
            console.error("[Webhook] Invalid tx_ref format:", verifiedTxRef);
            return NextResponse.json(
                { error: "Invalid transaction reference" },
                { status: 400 }
            );
        }

        // 8. Determine tier from amount
        const verifiedAmount = verification.data.amount || amount;
        const tier = getPlanByAmount(verifiedAmount);

        // 9. Update user subscription in Convex
        const webhookSecret = process.env.CONVEX_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new Error("CONVEX_WEBHOOK_SECRET not configured");
        }

        console.log("[Webhook] Updating subscription:", { clerkId, tier, amount: verifiedAmount });

        await fetchMutation(api.users.updateSubscription, {
            webhookSecret,
            clerkId,
            tier,
            status: "active",
            flwCustomerId: String(verification.data.customer?.id ?? customerId),
            flwSubscriptionId: String(verification.data.id),
        });

        console.log("[Webhook] ✅ Subscription updated successfully:", { clerkId, tier });

        return NextResponse.json({ status: "ok" });
    } catch (error) {
        console.error("[Webhook] Error processing webhook:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
