import { flwConfig } from "./config";

/**
 * Get access token for Flutterwave API requests
 * Uses Bearer token authentication with secret key
 */
export function getAccessToken(): string {
    return flwConfig.secretKey;
}

/**
 * Generic request helper for Flutterwave API
 */
export async function flwRequest<T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = endpoint.startsWith("http")
        ? endpoint
        : `${flwConfig.baseUrl}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAccessToken()}`,
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Flutterwave API error: ${error}`);
    }

    return response.json();
}
