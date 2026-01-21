// =============================================================================
// Stepease - AI Provider Configuration
// Loads and validates provider configs from environment variables
// =============================================================================

import { ProviderConfig, ProviderWithStatus, DEFAULT_FALLBACK_OPTIONS, FallbackOptions } from './ai-types';

function getEnv(key: string): string | undefined {
  return process.env[key];
}

function getOptionalEnv(key: string): string | undefined {
  const value = getEnv(key);
  if (value === undefined || value === '') {
    return undefined;
  }
  return value;
}

function parseProviderFromEnv(prefix: string): ProviderConfig | null {
  const name = getOptionalEnv(`${prefix}_NAME`);
  const model = getOptionalEnv(`${prefix}_MODEL`);
  const baseUrl = getOptionalEnv(`${prefix}_BASE_URL`);
  const apiKey = getOptionalEnv(`${prefix}_API_KEY`);

  if (!model) {
    return null;
  }

  return {
    name: name || 'unknown',
    model,
    baseUrl,
    apiKey,
  };
}

export function getProviderConfig(index: number): ProviderConfig | null {
  return parseProviderFromEnv(`PROVIDER_${index}`);
}

export function getAllProviderConfigs(): ProviderConfig[] {
  const providers: ProviderConfig[] = [];

  for (let i = 1; i <= 3; i++) {
    const provider = getProviderConfig(i);
    if (provider) {
      providers.push(provider);
    }
  }

  return providers;
}

export function validateProviderConfig(provider: ProviderConfig): ProviderWithStatus {
  const missingFields: string[] = [];

  if (!provider.model) {
    missingFields.push('model');
  }

  const needsApiKey = provider.name !== 'google';
  if (needsApiKey && !provider.apiKey) {
    missingFields.push('apiKey');
  }

  if (provider.baseUrl && !provider.baseUrl.startsWith('http')) {
    missingFields.push('baseUrl (must start with http:// or https://)');
  }

  return {
    ...provider,
    index: 0,
    isValid: missingFields.length === 0,
    missingFields,
  };
}

export function getValidProviderChain(): ProviderConfig[] {
  const allProviders = getAllProviderConfigs();
  const validProviders: ProviderConfig[] = [];

  for (const provider of allProviders) {
    const validated = validateProviderConfig(provider);
    if (validated.isValid) {
      validProviders.push(provider);
    } else {
      console.warn(
        `[AI-PROVIDER] Skipping provider '${provider.name}': missing ${validated.missingFields.join(', ')}`
      );
    }
  }

  if (validProviders.length === 0) {
    console.warn('[AI-PROVIDER] No valid AI providers configured!');
  } else {
    console.log(
      `[AI-PROVIDER] Loaded ${validProviders.length} provider(s): ${validProviders.map(p => `${p.name}/${p.model}`).join(', ')}`
    );
  }

  return validProviders;
}

export function getFallbackOptions(): FallbackOptions {
  return {
    maxRetries: parseInt(getOptionalEnv('PROVIDER_MAX_RETRIES') || String(DEFAULT_FALLBACK_OPTIONS.maxRetries)),
    backoffMultiplier: parseFloat(getOptionalEnv('PROVIDER_BACKOFF_MULTIPLIER') || String(DEFAULT_FALLBACK_OPTIONS.backoffMultiplier)),
    initialBackoffMs: parseInt(getOptionalEnv('PROVIDER_INITIAL_BACKOFF_MS') || String(DEFAULT_FALLBACK_OPTIONS.initialBackoffMs)),
    maxBackoffMs: parseInt(getOptionalEnv('PROVIDER_MAX_BACKOFF_MS') || String(DEFAULT_FALLBACK_OPTIONS.maxBackoffMs)),
    timeoutPerProvider: parseInt(getOptionalEnv('PROVIDER_TIMEOUT_MS') || String(DEFAULT_FALLBACK_OPTIONS.timeoutPerProvider)),
  };
}

export function shouldEnableFallback(): boolean {
  const env = getOptionalEnv('PROVIDER_FALLBACK_ENABLED');
  if (env === undefined) {
    return true;
  }
  return env.toLowerCase() === 'true' || env === '1';
}

export function getDefaultGoogleProvider(): ProviderConfig {
  return {
    name: 'google',
    model: 'gemini-3-flash-preview',
    apiKey: getOptionalEnv('GOOGLE_API_KEY') || process.env.GOOGLE_API_KEY,
  };
}

export function ensureDefaultProvider(): ProviderConfig[] {
  const providers = getValidProviderChain();

  if (providers.length === 0) {
    const defaultGoogle = getDefaultGoogleProvider();
    if (defaultGoogle.apiKey) {
      console.log('[AI-PROVIDER] No providers configured, using default Google provider');
      return [defaultGoogle];
    }
    throw new Error('[AI-PROVIDER] No AI providers configured and no default API key available');
  }

  return providers;
}

let cachedProviders: ProviderConfig[] | null = null;
let cachedOptions: FallbackOptions | null = null;

export function getCachedProviderChain(): ProviderConfig[] {
  if (!cachedProviders) {
    cachedProviders = ensureDefaultProvider();
  }
  return cachedProviders;
}

export function getCachedFallbackOptions(): FallbackOptions {
  if (!cachedOptions) {
    cachedOptions = getFallbackOptions();
  }
  return cachedOptions;
}

export function clearProviderCache(): void {
  cachedProviders = null;
  cachedOptions = null;
}
