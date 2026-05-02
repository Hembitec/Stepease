// =============================================================================
// Stepease - SOP Analyzer
// Analyzes SOP content and provides structured feedback
// Uses multi-provider fallback system for reliability
// =============================================================================

import { generateObject } from 'ai';
import { generateWithFallback, getCachedProviderChain } from '@/lib/ai-fallback';
import { getModelInstance } from '@/lib/ai-models';
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
  return providers.map((provider) => {
    return async () => {
      const result = await generateObject({
        model: getModelInstance(provider),
        schema: analysisResultSchema,
        system: SOP_ANALYSIS_PROMPT,
        prompt: `Please analyze the following SOP text:\n\n${text}`,
        temperature: 0.2,
      });
      return { object: result.object as AnalysisResult };
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
