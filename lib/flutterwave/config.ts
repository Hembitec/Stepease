/**
 * Flutterwave V3 API Configuration
 */

export const flwConfig = {
    secretKey: process.env.FLW_SECRET_KEY || "",
    publicKey: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY || "",
    webhookSecretHash: process.env.FLW_WEBHOOK_SECRET_HASH || "",
    baseUrl: "https://api.flutterwave.com/v3",
    planIds: {
        starter: process.env.FLW_PLAN_STARTER_ID || "",
        pro: process.env.FLW_PLAN_PRO_ID || "",
    },
};

/**
 * Validate that all required config values are set
 */
export function validateConfig() {
    const missing: string[] = [];

    if (!flwConfig.secretKey) missing.push("FLW_SECRET_KEY");
    if (!flwConfig.publicKey) missing.push("NEXT_PUBLIC_FLW_PUBLIC_KEY");
    if (!flwConfig.webhookSecretHash) missing.push("FLW_WEBHOOK_SECRET_HASH");

    if (missing.length > 0) {
        throw new Error(
            `Missing Flutterwave configuration: ${missing.join(", ")}`
        );
    }
}
