// =============================================================================
// Stepease - AI Provider Types
// Type definitions for multi-provider AI fallback system
// =============================================================================

export type ProviderName = 'google' | 'openrouter' | 'groq' | string;

export interface ProviderConfig {
  name: string;
  baseUrl?: string;
  model: string;
  apiKey?: string;
}

export interface ProviderWithStatus extends ProviderConfig {
  index: number;
  isValid: boolean;
  missingFields: string[];
}

export interface RetryAttempt {
  providerIndex: number;
  providerName: string;
  model: string;
  attempt: number;
  maxRetries: number;
  waitMs: number;
  error?: string;
}

export interface ProviderResult<T = unknown> {
  success: boolean;
  provider: ProviderConfig;
  attempt: number;
  duration: number;
  error?: string;
  data?: T;
}

export interface StreamResult {
  success: boolean;
  provider: ProviderConfig;
  duration: number;
  error?: string;
  response?: Response;
}

export type RetryableErrorCodes = 429 | 500 | 502 | 503 | 504;

export interface FallbackOptions {
  maxRetries: number;
  backoffMultiplier: number;
  initialBackoffMs: number;
  maxBackoffMs: number;
  timeoutPerProvider: number;
}

export const DEFAULT_FALLBACK_OPTIONS: FallbackOptions = {
  maxRetries: 3,
  backoffMultiplier: 2,
  initialBackoffMs: 1000,
  maxBackoffMs: 10000,
  timeoutPerProvider: 20000,
};

export function isRetryableError(status: number): status is RetryableErrorCodes {
  return [429, 500, 502, 503, 504].includes(status);
}

export function getRetryableErrorMessage(error: unknown): string | undefined {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (
      message.includes('rate limit') ||
      message.includes('429') ||
      message.includes('503') ||
      message.includes('500') ||
      message.includes('502') ||
      message.includes('504') ||
      message.includes('timeout') ||
      message.includes('econnreset') ||
      message.includes('network') ||
      message.includes('failed to fetch')
    ) {
      return error.message;
    }
  }
  return undefined;
}
