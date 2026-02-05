import { flwConfig } from "./config";



/**
 * Get a valid access token (using Secret Key for Standard V3 API)
 */
export async function getAccessToken(): Promise<string> {
    // For Standard V3 API, the Secret Key is used as the Bearer token
    return flwConfig.secretKey;
}

/**
 * Make an authenticated request to Flutterwave API
 */
export async function flwRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = await getAccessToken();

    const response = await fetch(`${flwConfig.baseUrl}${endpoint}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Flutterwave API error: ${response.status} - ${error}`);
    }

    return response.json();
}
