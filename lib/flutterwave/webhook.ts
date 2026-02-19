import { flwConfig } from "./config";

/**
 * Verify webhook signature from Flutterwave
 *
 * Per Flutterwave official docs:
 * - Flutterwave sends your secret hash DIRECTLY in the `verif-hash` header
 * - You compare this header value with your stored secret hash
 * - It's a simple string comparison, NOT HMAC
 *
 * Reference: https://developer.flutterwave.com/docs/webhooks
 */
export function verifyWebhookSignature(
    verifHash: string | null
): boolean {
    if (!verifHash) {
        console.error("[Webhook] No verif-hash header present");
        return false;
    }

    const secretHash = flwConfig.webhookSecretHash;
    if (!secretHash) {
        console.error("[Webhook] FLW_WEBHOOK_SECRET_HASH not configured");
        return false;
    }

    // Simple comparison — Flutterwave sends the secret hash directly
    const isValid = verifHash === secretHash;

    if (!isValid) {
        console.error("[Webhook] Hash mismatch. Received:", verifHash.substring(0, 8) + "...");
    }

    return isValid;
}

/**
 * Parse webhook payload with type safety
 */
export interface WebhookPayload {
    event: string;
    data: {
        id: number;
        tx_ref?: string;
        flw_ref?: string;
        amount?: number;
        currency?: string;
        status: string;
        payment_type?: string;
        customer: {
            id: number;
            email: string;
            name?: string;
        };
    };
}

export function parseWebhookPayload(rawBody: string): WebhookPayload {
    return JSON.parse(rawBody);
}
