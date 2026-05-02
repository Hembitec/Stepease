import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { ProviderConfig } from './ai-types';

/**
 * Stepease - AI Model Factory
 * Centralizes the creation and caching of AI provider instances.
 */

const providerCache = new Map<string, any>();

/**
 * Returns a model instance for the given provider configuration.
 * Uses a cache to avoid re-creating provider objects on every request.
 */
export function getModelInstance(provider: ProviderConfig) {
  const cacheKey = `${provider.name}:${provider.baseUrl || 'default'}`;

  if (provider.name === 'google') {
    let googleProvider = providerCache.get(cacheKey);
    if (!googleProvider) {
      googleProvider = createGoogleGenerativeAI({
        apiKey: provider.apiKey,
      });
      providerCache.set(cacheKey, googleProvider);
    }
    return googleProvider(provider.model);
  }

  if (provider.name.toLowerCase().includes('groq')) {
    let groqProvider = providerCache.get(cacheKey);
    if (!groqProvider) {
      groqProvider = createGroq({
        apiKey: provider.apiKey,
      });
      providerCache.set(cacheKey, groqProvider);
    }
    return groqProvider(provider.model);
  }

  // Default to Generic OpenAI Compatible for OpenRouter, Mistral, etc.
  let openaiCompatible = providerCache.get(cacheKey);
  if (!openaiCompatible) {
    openaiCompatible = createOpenAICompatible({
      baseURL: provider.baseUrl || 'https://api.openai.com/v1',
      name: provider.name,
      apiKey: provider.apiKey,
    });
    providerCache.set(cacheKey, openaiCompatible);
  }
  return openaiCompatible(provider.model) as any;
}
