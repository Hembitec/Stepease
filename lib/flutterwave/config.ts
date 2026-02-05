/**
 * Flutterwave v3 API Configuration (Standard)
 */
export const flwConfig = {
    // Try to use Secret Key first (Standard), fallback to Client Secret if being used as Secret Key
    secretKey: process.env.FLW_SECRET_KEY || process.env.FLW_CLIENT_SECRET!,
    webhookSecretHash: process.env.FLW_WEBHOOK_SECRET_HASH!,
    publicKey: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY!,
    baseUrl: "https://api.flutterwave.com/v3",
} as const;

/**
 * Validate required environment variables
 */
export function validateConfig() {
    const required: string[] = [];

    // Check if we have a secret key (either variable works)
    if (!process.env.FLW_SECRET_KEY && !process.env.FLW_CLIENT_SECRET) {
        throw new Error("Missing Flutterwave Secret Key (FLW_SECRET_KEY)");
    }

    const missing = required.filter((key) => !process.env[key]);



    if (missing.length > 0) {
        throw new Error(`Missing Flutterwave environment variables: ${missing.join(", ")}`);
    }
}
