// =============================================================================
// Stepease - SOP Analyzer
// Analyzes SOP content and provides structured feedback
// Uses multi-provider fallback system for reliability
// =============================================================================

import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateWithFallback, getCachedProviderChain } from '@/lib/ai-fallback';
import { z } from 'zod';
import { SOP_ANALYSIS_PROMPT } from '@/lib/sop-system-prompt';
import { ProviderConfig } from '@/lib/ai-types';

export interface AnalysisResult {
  title: string; // Extracted title from the document
  structure: {
    hasHeader: boolean;
    hasPurpose: boolean;
    hasScope: boolean;
    hasRoles: boolean;
    hasDefinitions: boolean;
    hasReferences: boolean;
    hasMaterials: boolean;
    hasProcedures: boolean;
    hasQuality: boolean;
    hasTroubleshooting: boolean;
    hasAppendices: boolean;
    hasRevision: boolean;
    completenessScore: number;
  };
  quality: {
    clarity: number;
    actionability: number;
    completeness: number;
    overall: number;
  };
  strengths: string[];
  improvements: Array<{
    category: 'Structure' | 'Clarity' | 'Content' | 'Safety';
    priority: 'High' | 'Medium' | 'Low';
    description: string;
    suggestion: string;
  }>;
  summary: string;
}

const analysisResultSchema = z.object({
  title: z.string().describe('The extracted or inferred title of the SOP document'),
  structure: z.object({
    hasHeader: z.boolean(),
    hasPurpose: z.boolean(),
    hasScope: z.boolean(),
    hasRoles: z.boolean(),
    hasDefinitions: z.boolean(),
    hasReferences: z.boolean(),
    hasMaterials: z.boolean(),
    hasProcedures: z.boolean(),
    hasQuality: z.boolean(),
    hasTroubleshooting: z.boolean(),
    hasAppendices: z.boolean(),
    hasRevision: z.boolean(),
    completenessScore: z.number(),
  }),
  quality: z.object({
    clarity: z.number(),
    actionability: z.number(),
    completeness: z.number(),
    overall: z.number(),
  }),
  strengths: z.array(z.string()),
  improvements: z.array(
    z.object({
      category: z.enum(['Structure', 'Clarity', 'Content', 'Safety']),
      priority: z.enum(['High', 'Medium', 'Low']),
      description: z.string(),
      suggestion: z.string(),
    })
  ),
  summary: z.string(),
});

function createGenerateFunctions(
  text: string,
  providers: ProviderConfig[]
): Array<() => Promise<{ object: AnalysisResult }>> {
  const providerCache = new Map<string, any>();

  return providers.map((provider) => {
    return async () => {
      // Google Provider
      if (provider.name === 'google') {
        let googleProvider = providerCache.get(provider.name);
        if (!googleProvider) {
          googleProvider = createGoogleGenerativeAI({
            apiKey: provider.apiKey,
          });
          providerCache.set(provider.name, googleProvider);
        }

        const result = await generateObject({
          model: googleProvider(provider.model),
          schema: analysisResultSchema,
          system: SOP_ANALYSIS_PROMPT,
          prompt: `Please analyze the following SOP text:\n\n${text}`,
          temperature: 0.2,
        });
        return { object: result.object as AnalysisResult };
      }
      // Groq Provider
      else if (provider.name.toLowerCase().includes('groq')) {
        let groqProvider = providerCache.get(provider.name);
        if (!groqProvider) {
          groqProvider = createGroq({
            apiKey: provider.apiKey,
          });
          providerCache.set(provider.name, groqProvider);
        }

        const result = await generateObject({
          model: groqProvider(provider.model),
          schema: analysisResultSchema,
          system: SOP_ANALYSIS_PROMPT,
          prompt: `Please analyze the following SOP text:\n\n${text}`,
          temperature: 0.2,
        });
        return { object: result.object as AnalysisResult };
      }
      // Generic OpenAI Compatible
      else {
        let openaiCompatible = providerCache.get(provider.name);
        if (!openaiCompatible) {
          openaiCompatible = createOpenAICompatible({
            baseURL: provider.baseUrl || 'https://api.example.com/v1',
            name: provider.name,
            apiKey: provider.apiKey,
          });
          providerCache.set(provider.name, openaiCompatible);
        }

        const result = await generateObject({
          model: openaiCompatible(provider.model) as any,
          schema: analysisResultSchema,
          system: SOP_ANALYSIS_PROMPT,
          prompt: `Please analyze the following SOP text:\n\n${text}`,
          temperature: 0.2,
        });
        return { object: result.object as AnalysisResult };
      }
    };
  });
}

export async function analyzeSOPText(text: string): Promise<AnalysisResult> {
  try {
    const providers = getCachedProviderChain();
    const generateFunctions = createGenerateFunctions(text, providers);

    const { object } = await generateWithFallback(generateFunctions, providers);

    return object;
  } catch (error) {
    console.error('[AI-PROVIDER] SOP Analysis Error:', error);
    throw new Error('Failed to analyze SOP content');
  }
}
