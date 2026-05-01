import { NextRequest, NextResponse } from "next/server";
import {
    verifyWebhookSignature,
    verifyTransaction,
    getPlanByAmount
} from "@/lib/flutterwave";
import { api } from "@/convex/_generated/api";
import { fetchMutation, fetchQuery } from "convex/nextjs";

/**
 * Flutterwave Webhook Handler
 *
 * Security pipeline:
 * 1. Verify verif-hash signature header
 * 2. Parse event type (charge.completed / subscription.cancelled / charge.failed)
 * 3. Re-verify the transaction against Flutterwave API
 * 4. Idempotency check — skip if transaction already recorded in payment_history
 * 5. Update user subscription and record payment in Convex
 *
 * Payload note: Flutterwave sends FLAT payloads (no event/data wrapper):
 * { id, txRef, status, amount, customer, "event.type" }
 * But the verify API responds WITH a wrapper: { data: { id, tx_ref, ... } }
 */

const isDev = process.env.NODE_ENV === "development";

function log(level: "info" | "warn" | "error", message: string, data?: unknown) {
    if (level === "error") {
        console.error(`[Webhook] ${message}`, data ?? "");
    } else if (isDev) {
        console[level](`[Webhook] ${message}`, data ?? "");
    }
}

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
    event?: string;
    // Some cancellation events use a nested structure
    data?: {
        id: number;
        status: string;
        tx_ref?: string;
        amount?: number;
        currency?: string;
        customer: {
            id: number;
            email: string;
        };
    };
}

export async function POST(req: NextRequest) {
    try {
        // 1. Read raw body for signature verification
        const rawBody = await req.text();

        // 2. Verify webhook via verif-hash header
        const verifHash = req.headers.get("verif-hash");
        log("info", `Request received. verif-hash: ${verifHash ? "present" : "missing"}`);

        if (!verifyWebhookSignature(verifHash)) {
            log("error", "Signature verification failed");
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        log("info", "Signature verified ✓");

        // 3. Parse payload
        const payload: FlwWebhookPayload = JSON.parse(rawBody);

        // Normalize payload — Flutterwave sends flat OR nested depending on event type
        const txnId = payload.data?.id ?? payload.id;
        const txRef = payload.data?.tx_ref ?? payload.txRef ?? payload.tx_ref ?? "";
        const status = payload.data?.status ?? payload.status;
        const amount = payload.data?.amount ?? payload.amount;
        const currency = payload.data?.currency ?? payload.currency ?? "USD";
        const customerId = payload.data?.customer?.id ?? payload.customer?.id;
        const eventType = payload.event ?? payload["event.type"] ?? "unknown";

        log("info", `Event: ${eventType}`, { txnId, txRef, status, amount });

        // 4. Handle subscription cancellation
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

            log("info", `Processing cancellation for: ${email}`);

            const webhookSecret = process.env.CONVEX_WEBHOOK_SECRET;
            if (!webhookSecret) throw new Error("CONVEX_WEBHOOK_SECRET not configured");

            const flwCustomerId = String(customerId);

            await fetchMutation(api.users.cancelSubscription, {
                webhookSecret,
                flwCustomerId,
            });

            log("info", `Subscription cancelled for customer: ${flwCustomerId}`);
            return NextResponse.json({ status: "ok" });
        }

        // 5. Handle failed charges — mark user as past_due
        if (
            eventType === "charge.failed" ||
            eventType === "CHARGE_FAILED" ||
            status === "failed"
        ) {
            log("warn", `Failed charge event received for txRef: ${txRef}`);

            const webhookSecret = process.env.CONVEX_WEBHOOK_SECRET;
            if (!webhookSecret) throw new Error("CONVEX_WEBHOOK_SECRET not configured");

            // Try to parse the clerkId from tx_ref (best effort)
            const parts = txRef.split("_");
            const clerkId = parts.slice(1, -1).join("_");

            if (clerkId) {
                // Set status to past_due without changing the tier
                await fetchMutation(api.users.updateSubscription, {
                    webhookSecret,
                    clerkId,
                    tier: "free", // Will be overridden — we only care about status
                    status: "past_due",
                    flwTransactionId: String(txnId),
                    flwTxRef: txRef,
                    amount: amount ?? 0,
                    currency,
                });
            }

            return NextResponse.json({ status: "noted" });
        }

        // 6. Only process successful transactions beyond this point
        if (status !== "successful") {
            log("info", `Ignoring non-successful status: ${status}`);
            return NextResponse.json({ status: "ignored" });
        }

        // 7. Re-verify transaction with Flutterwave API (critical security step)
        log("info", `Re-verifying transaction: ${txnId}`);
        const verification = await verifyTransaction(txnId);

        if (verification.data.status !== "successful") {
            log("error", `Verification failed: ${verification.data.status}`);
            return NextResponse.json(
                { error: "Transaction not successful" },
                { status: 400 }
            );
        }

        // 8. Extract clerk user ID from tx_ref
        // Format: sub_user_xxxxx_timestamp → extract "user_xxxxx"
        const verifiedTxRef = verification.data.tx_ref || txRef;
        const parts = verifiedTxRef.split("_");
        const clerkId = parts.slice(1, -1).join("_");

        if (!clerkId) {
            log("error", `Invalid tx_ref format: ${verifiedTxRef}`);
            return NextResponse.json(
                { error: "Invalid transaction reference" },
                { status: 400 }
            );
        }

        // 9. Determine tier from verified amount
        const verifiedAmount = verification.data.amount || amount;
        const verifiedCurrency = verification.data.currency || currency;
        const tier = getPlanByAmount(verifiedAmount);
        const flwTransactionId = String(verification.data.id ?? txnId);

        log("info", "Updating subscription", { clerkId, tier, amount: verifiedAmount });

        // 10. Update user subscription in Convex (includes payment_history write + activity log)
        const webhookSecret = process.env.CONVEX_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new Error("CONVEX_WEBHOOK_SECRET not configured");
        }

        await fetchMutation(api.users.updateSubscription, {
            webhookSecret,
            clerkId,
            tier,
            status: "active",
            flwCustomerId: String(verification.data.customer?.id ?? customerId),
            flwSubscriptionId: String(verification.data.id),
            // Payment history fields
            flwTransactionId,
            flwTxRef: verifiedTxRef,
            amount: verifiedAmount,
            currency: verifiedCurrency,
        });

        log("info", `✅ Subscription updated: ${clerkId} → ${tier}`);
        return NextResponse.json({ status: "ok" });

    } catch (error) {
        log("error", "Error processing webhook", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
