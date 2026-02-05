import crypto from "crypto";
import { flwConfig } from "./config";

/**
 * Verify webhook signature using HMAC-SHA256
 *
 * Security: Always verify the signature before processing webhook data
 */
export function verifyWebhookSignature(
    rawBody: string,
    signature: string | null
): boolean {
    if (!signature) {
        return false;
    }

    const hash = crypto
        .createHmac("sha256", flwConfig.webhookSecretHash)
        .update(rawBody)
        .digest("base64");

    // Use timing-safe comparison to prevent timing attacks
    try {
        return crypto.timingSafeEqual(
            Buffer.from(hash),
            Buffer.from(signature)
        );
    } catch {
        return false;
    }
}

/**
 * Parse webhook payload with type safety
 */
export interface WebhookPayload {
    event: string;
    data: {
        id: number;
        tx_ref: string;
        flw_ref: string;
        amount: number;
        currency: string;
        status: string;
        payment_type: string;
        customer: {
            id: number;
            email: string;
            name: string;
        };
    };
}

export function parseWebhookPayload(rawBody: string): WebhookPayload {
    return JSON.parse(rawBody);
}
