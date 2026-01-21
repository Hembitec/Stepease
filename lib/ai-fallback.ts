// =============================================================================
// Stepease - AI Fallback System
// Core fallback logic with retry, exponential backoff, and provider chain
// =============================================================================

import {
  ProviderConfig,
  ProviderResult,
  StreamResult,
  FallbackOptions,
  DEFAULT_FALLBACK_OPTIONS,
} from './ai-types';
import { getCachedProviderChain, getCachedFallbackOptions, shouldEnableFallback } from './ai-provider-config';

const GENERATE_ID_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';
export function generateId(prefix: string = 'req'): string {
  const randomPart = Array.from({ length: 16 }, () =>
    GENERATE_ID_CHARS[Math.floor(Math.random() * GENERATE_ID_CHARS.length)]
  ).join('');
  return `${prefix}-${Date.now()}-${randomPart}`;
}

function logInfo(requestId: string, message: string, details?: Record<string, unknown>): void {
  console.log(`[AI-PROVIDER] [${new Date().toISOString()}] [INFO] ${message}`, details || '');
}

function logWarn(requestId: string, message: string, details?: Record<string, unknown>): void {
  console.log(`[AI-PROVIDER] [${new Date().toISOString()}] [WARN] ${message}`, details || '');
}

function logError(requestId: string, message: string, details?: Record<string, unknown>): void {
  console.log(`[AI-PROVIDER] [${new Date().toISOString()}] [ERROR] ${message}`, details || '');
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function calculateBackoff(attempt: number, options: FallbackOptions): number {
  const backoff = options.initialBackoffMs * Math.pow(options.backoffMultiplier, attempt);
  return Math.min(backoff, options.maxBackoffMs);
}

function shouldRetry(error: string | undefined, attempt: number, maxRetries: number): boolean {
  if (attempt >= maxRetries) return false;
  if (!error) return false;

  const lowerError = error.toLowerCase();
  if (lowerError.includes('rate limit') || lowerError.includes('429')) return true;
  if (lowerError.includes('503') || lowerError.includes('500') || lowerError.includes('502')) return true;
  if (lowerError.includes('timeout') || lowerError.includes('network') || lowerError.includes('econnreset')) return true;
  return false;
}

function getProviderLabel(provider: ProviderConfig): string {
  return `${provider.name}/${provider.model}`;
}

async function streamWithProvider(
  provider: ProviderConfig,
  fn: () => Promise<Response>,
  requestId: string,
  attempt: number,
  maxRetries: number,
  waitMs: number
): Promise<StreamResult> {
  const startTime = Date.now();

  logInfo(requestId, `Attempting provider: ${getProviderLabel(provider)}`, { attempt, maxRetries, waitMs });

  if (waitMs > 0) {
    logInfo(requestId, `Waiting ${waitMs}ms before retry`, { provider: getProviderLabel(provider), attempt });
    await sleep(waitMs);
  }

  try {
    const startTimeInner = Date.now();
    const response = await Promise.race([
      fn(),
      new Promise<Response>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout after 30s')), 30000)
      ),
    ]);
    const duration = Date.now() - startTimeInner;

    if (response.ok) {
      logInfo(requestId, `Provider success: ${getProviderLabel(provider)}`, { duration: `${duration}ms` });
      return { success: true, provider, duration, response };
    }

    const errorText = await response.text().catch(() => 'Unknown error');
    const durationTotal = Date.now() - startTime;

    logWarn(requestId, `Provider failed: ${getProviderLabel(provider)}`, {
      attempt,
      status: response.status,
      error: errorText.slice(0, 200),
      duration: `${durationTotal}ms`,
    });

    return { success: false, provider, duration: durationTotal, error: `HTTP ${response.status}: ${errorText.slice(0, 100)}` };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    logWarn(requestId, `Provider error: ${getProviderLabel(provider)}`, {
      attempt,
      error: errorMessage,
      duration: `${duration}ms`,
    });

    return { success: false, provider, duration, error: errorMessage };
  }
}

async function generateWithProvider<T>(
  provider: ProviderConfig,
  fn: () => Promise<{ object: T }>,
  requestId: string,
  attempt: number,
  maxRetries: number,
  waitMs: number
): Promise<ProviderResult<T>> {
  const startTime = Date.now();

  logInfo(requestId, `Attempting provider: ${getProviderLabel(provider)}`, { attempt, maxRetries, waitMs });

  if (waitMs > 0) {
    logInfo(requestId, `Waiting ${waitMs}ms before retry`, { provider: getProviderLabel(provider), attempt });
    await sleep(waitMs);
  }

  try {
    const startTimeInner = Date.now();
    const result = await Promise.race([
      fn(),
      new Promise<{ object: T }>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout after 30s')), 30000)
      ),
    ]);
    const duration = Date.now() - startTimeInner;

    logInfo(requestId, `Provider success: ${getProviderLabel(provider)}`, { duration: `${duration}ms` });

    return { success: true, provider, attempt, duration, data: result.object };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    logWarn(requestId, `Provider failed: ${getProviderLabel(provider)}`, {
      attempt,
      error: errorMessage,
      duration: `${duration}ms`,
    });

    return { success: false, provider, attempt, duration, error: errorMessage };
  }
}

export async function streamWithFallback(
  fns: Array<() => Promise<Response>>,
  providers: ProviderConfig[],
  options?: FallbackOptions
): Promise<{ response: Response; provider: ProviderConfig; attempt: number; totalDuration: number }> {
  const requestId = generateId('stream');
  const effectiveOptions = options || getCachedFallbackOptions();

  if (!shouldEnableFallback() || providers.length === 1) {
    const provider = providers[0];
    logInfo(requestId, `Single provider mode: ${getProviderLabel(provider)}`);
    const result = await streamWithProvider(provider, fns[0], requestId, 1, 1, 0);
    if (result.success && result.response) {
      return {
        response: result.response,
        provider,
        attempt: 1,
        totalDuration: result.duration,
      };
    }
    throw new Error(`Single provider failed: ${result.error}`);
  }

  let totalDuration = 0;
  const lastError = { error: 'No providers available' };

  for (let providerIndex = 0; providerIndex < providers.length; providerIndex++) {
    const provider = providers[providerIndex];
    const fn = fns[providerIndex];

    for (let attempt = 0; attempt <= effectiveOptions.maxRetries; attempt++) {
      const waitMs = attempt > 0 ? calculateBackoff(attempt - 1, effectiveOptions) : 0;

      const result = await streamWithProvider(provider, fn, requestId, attempt + 1, effectiveOptions.maxRetries, waitMs);
      totalDuration += result.duration;

      if (result.success && result.response) {
        return {
          response: result.response,
          provider,
          attempt: attempt + 1,
          totalDuration,
        };
      }

      lastError.error = result.error || 'Unknown error';

      if (!shouldRetry(result.error, attempt, effectiveOptions.maxRetries)) {
        break;
      }
    }

    if (providerIndex < providers.length - 1) {
      logWarn(requestId, `Switching provider: ${providers[providerIndex].name} → ${providers[providerIndex + 1].name}`, {
        reason: 'max_retries_exceeded',
        lastError: lastError.error,
      });
    }
  }

  logError(requestId, 'All providers failed', {
    providers: providers.map((p) => p.name),
    totalDuration: `${totalDuration}ms`,
    lastError: lastError.error,
  });

  throw new Error(`All AI providers failed. Last error: ${lastError.error}`);
}

export async function generateWithFallback<T>(
  fns: Array<() => Promise<{ object: T }>>,
  providers: ProviderConfig[],
  options?: FallbackOptions
): Promise<{ object: T; provider: ProviderConfig; attempt: number; totalDuration: number }> {
  const requestId = generateId('gen');
  const effectiveOptions = options || getCachedFallbackOptions();

  const providerChain = providers.length > 0 ? providers : getCachedProviderChain();

  if (!shouldEnableFallback() || providerChain.length === 1) {
    const provider = providerChain[0];
    logInfo(requestId, `Single provider mode: ${getProviderLabel(provider)}`);
    const result = await generateWithProvider(provider, fns[0], requestId, 1, 1, 0);
    if (result.success && result.data) {
      return { object: result.data, provider, attempt: 1, totalDuration: result.duration };
    }
    throw new Error('Single provider failed: ' + result.error);
  }

  let totalDuration = 0;
  const lastError = { error: 'No providers available' };

  for (let providerIndex = 0; providerIndex < providerChain.length; providerIndex++) {
    const provider = providerChain[providerIndex];
    const fn = fns[providerIndex];

    for (let attempt = 0; attempt <= effectiveOptions.maxRetries; attempt++) {
      const waitMs = attempt > 0 ? calculateBackoff(attempt - 1, effectiveOptions) : 0;

      const result = await generateWithProvider(provider, fn, requestId, attempt + 1, effectiveOptions.maxRetries, waitMs);
      totalDuration += result.duration;

      if (result.success && result.data) {
        logInfo(requestId, `Final provider success: ${getProviderLabel(provider)}`, {
          attempt: attempt + 1,
          totalDuration: `${totalDuration}ms`,
        });
        return { object: result.data, provider, attempt: attempt + 1, totalDuration };
      }

      lastError.error = result.error || 'Unknown error';

      if (!shouldRetry(result.error, attempt, effectiveOptions.maxRetries)) {
        break;
      }
    }

    if (providerIndex < providerChain.length - 1) {
      logWarn(requestId, `Switching provider: ${providerChain[providerIndex].name} → ${providerChain[providerIndex + 1].name}`, {
        reason: 'max_retries_exceeded',
        lastError: lastError.error,
      });
    }
  }

  logError(requestId, 'All providers failed', {
    providers: providerChain.map((p) => p.name),
    totalDuration: `${totalDuration}ms`,
    lastError: lastError.error,
  });

  throw new Error(`All AI providers failed. Last error: ${lastError.error}`);
}

export { logInfo, logWarn, logError };
export { getCachedProviderChain, getCachedFallbackOptions, shouldEnableFallback } from './ai-provider-config';
