// =============================================================================
// Stepease - SOP CHAT API ROUTE
// Handles conversational AI for SOP creation and improvement
// Uses multi-provider fallback system for reliability
// =============================================================================

import { streamObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { streamWithFallback, getCachedProviderChain } from '@/lib/ai-fallback';
import { SOP_SYSTEM_PROMPT, IMPROVE_SOP_SYSTEM_PROMPT } from '@/lib/sop-system-prompt';
import { aiResponseSchema } from '@/lib/types';
import { ProviderConfig } from '@/lib/ai-types';

export const maxDuration = 60;

interface RequestBody {
  messages: any[];
  mode?: string;
  existingNotes?: Array<{
    category: string;
    content: string;
    relatedTo: string;
  }>;
  analysisContext?: {
    summary: string;
    strengths: string[];
    improvements: Array<{
      category: string;
      priority: string;
      description: string;
      suggestion: string;
    }>;
    quality: {
      overall: number;
    };
  };
}

function buildContextPrefix(body: RequestBody): string {
  let contextPrefix = '';

  if (body.existingNotes && body.existingNotes.length > 0) {
    contextPrefix += `
EXISTING NOTES (from previous conversation - continue here):
${body.existingNotes.map((n, i) =>
      `${i + 1}. [${n.category}] ${n.content} (Related to: ${n.relatedTo})`
    ).join('\n')}

The user is resuming their SOP creation. These notes were already extracted. Continue the conversation naturally, building on what was discussed. Do NOT re-ask questions about topics already covered in the notes.

`;
  }

  if (body.mode === 'improve' && body.analysisContext) {
    contextPrefix += `
ANALYSIS CONTEXT (from prior analysis):
- Overall Quality Score: ${body.analysisContext.quality.overall}/100
- Summary: ${body.analysisContext.summary}
- Strengths: ${body.analysisContext.strengths.join(', ')}
- Improvements needed (in priority order):
${body.analysisContext.improvements.map((imp, i) =>
      `  ${i + 1}. [${imp.priority.toUpperCase()}] ${imp.description}`
    ).join('\n')}

Continue helping the user address these improvements one by one, starting with HIGH priority.

`;
  }

  return contextPrefix;
}

function getSystemPrompt(mode: string): string {
  return mode === 'improve' ? IMPROVE_SOP_SYSTEM_PROMPT : SOP_SYSTEM_PROMPT;
}

function createStreamFunctions(
  body: RequestBody,
  systemPrompt: string,
  contextPrefix: string,
  providers: ProviderConfig[]
): Array<() => Promise<Response>> {
  const providerCache = new Map<string, any>();

  return providers.map((provider) => {
    return async () => {
      const prompt = `${contextPrefix}Conversation history: ${JSON.stringify(body.messages)}`;

      // Google Provider
      if (provider.name === 'google') {
        let googleProvider = providerCache.get(provider.name);
        if (!googleProvider) {
          googleProvider = createGoogleGenerativeAI({
            apiKey: provider.apiKey,
          });
          providerCache.set(provider.name, googleProvider);
        }

        const result = streamObject({
          model: googleProvider(provider.model),
          system: systemPrompt,
          schema: aiResponseSchema,
          prompt,
          temperature: 0.2,
        });
        return result.toTextStreamResponse();
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

        const result = streamObject({
          model: groqProvider(provider.model),
          system: systemPrompt,
          schema: aiResponseSchema,
          prompt,
          temperature: 0.2,
        });
        return result.toTextStreamResponse();
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

        const result = streamObject({
          model: openaiCompatible(provider.model) as any,
          system: systemPrompt,
          schema: aiResponseSchema,
          prompt,
          temperature: 0.2,
        });
        return result.toTextStreamResponse();
      }
    };
  });
}

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();
    const systemPrompt = getSystemPrompt(body.mode || 'create');
    const contextPrefix = buildContextPrefix(body);

    const providers = getCachedProviderChain();

    const streamFunctions = createStreamFunctions(body, systemPrompt, contextPrefix, providers);

    const { response } = await streamWithFallback(streamFunctions, providers);

    return response;
  } catch (error) {
    console.error('[AI-PROVIDER] SOP Chat API Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return new Response(
      JSON.stringify({
        error: 'Failed to process chat request',
        details: errorMessage,
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
