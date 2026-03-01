// =============================================================================
// Stepease - SOP CHAT API ROUTE
// Handles conversational AI for SOP creation and improvement
// Uses sequential provider fallback with stream verification
// =============================================================================

import { streamObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { getCachedProviderChain } from '@/lib/ai-fallback';
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
  revisionContext?: {
    sopTitle: string;
    currentVersion: number;
    reason?: string;
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

  if (body.revisionContext) {
    const rc = body.revisionContext;
    contextPrefix += `
REVISION CONTEXT:
- This is a REVISION of an existing SOP: "${rc.sopTitle}"
- The user is working on version ${rc.currentVersion + 1} (revising from v${rc.currentVersion})
${rc.reason ? `- Reason for revision: ${rc.reason}` : '- No specific reason provided'}

This is NOT a new SOP. The user wants to improve or update their existing document. Ask what specific changes they want to make. Be focused and efficient — they already have a working SOP.

`;
  }

  return contextPrefix;
}

function getSystemPrompt(mode: string): string {
  return mode === 'improve' ? IMPROVE_SOP_SYSTEM_PROMPT : SOP_SYSTEM_PROMPT;
}

// -----------------------------------------------------------------------------
// Provider Instance Factory
// Cached provider instances to avoid re-creating them on every request
// -----------------------------------------------------------------------------

const providerCache = new Map<string, any>();

function getModelInstance(provider: ProviderConfig) {
  if (provider.name === 'google') {
    let googleProvider = providerCache.get(provider.name);
    if (!googleProvider) {
      googleProvider = createGoogleGenerativeAI({ apiKey: provider.apiKey });
      providerCache.set(provider.name, googleProvider);
    }
    return googleProvider(provider.model);
  }

  if (provider.name.toLowerCase().includes('groq')) {
    let groqProvider = providerCache.get(provider.name);
    if (!groqProvider) {
      groqProvider = createGroq({ apiKey: provider.apiKey });
      providerCache.set(provider.name, groqProvider);
    }
    return groqProvider(provider.model);
  }

  // Generic OpenAI Compatible
  let openaiCompatible = providerCache.get(provider.name);
  if (!openaiCompatible) {
    openaiCompatible = createOpenAICompatible({
      baseURL: provider.baseUrl || 'https://api.example.com/v1',
      name: provider.name,
      apiKey: provider.apiKey,
    });
    providerCache.set(provider.name, openaiCompatible);
  }
  return openaiCompatible(provider.model) as any;
}

// -----------------------------------------------------------------------------
// Try Stream with Provider
// Returns a Response if the provider stream starts successfully.
// Throws if it fails (caught by the caller to try the next provider).
//
// HOW IT WORKS:
//   The AI SDK's streamObject() returns immediately — the actual API call is
//   deferred until the stream is consumed. Errors (like 503 overload or 400
//   schema rejection) are emitted as internal stream chunks, so a naive
//   `response.ok` check always returns true.
//
//   To catch these errors BEFORE committing to a provider, we race:
//     - result.object (a promise that resolves when the FULL object is ready,
//       or REJECTS if the provider errors at any point during streaming)
//     - A short 5-second timeout (enough for the initial API handshake and
//       first chunk to come through)
//
//   If the object promise rejects before the timeout, we know the provider
//   failed and can try the next one. If the timeout fires first, the stream
//   hasn't errored yet so we assume it's working and return the response.
// -----------------------------------------------------------------------------

async function tryStreamWithProvider(
  provider: ProviderConfig,
  prompt: string,
  systemPrompt: string,
): Promise<Response> {
  const label = `${provider.name}/${provider.model}`;

  console.log(`[AI-PROVIDER] [${new Date().toISOString()}] [INFO] Trying provider: ${label}`);

  const result = streamObject({
    model: getModelInstance(provider),
    system: systemPrompt,
    schema: aiResponseSchema,
    prompt,
    temperature: 0.2,
  });

  // Race: wait for either the object to reject (provider error) or a 5s
  // timeout (meaning the stream hasn't errored yet → it's likely working).
  const VERIFICATION_TIMEOUT_MS = 5000;

  await Promise.race([
    // This rejects if the provider returns an error at any point
    result.object.then(
      () => { /* resolved = great, stream completed fully */ },
      (err) => { throw err; } // re-throw to trigger fallback
    ),
    // Timeout: if no error after 5s, the stream is probably working fine
    new Promise<void>((resolve) => setTimeout(resolve, VERIFICATION_TIMEOUT_MS)),
  ]);

  console.log(`[AI-PROVIDER] [${new Date().toISOString()}] [INFO] Provider accepted: ${label}`);

  // The stream is working — return the SDK's native response format which
  // is compatible with the useObject hook on the frontend.
  return result.toTextStreamResponse();
}

// -----------------------------------------------------------------------------
// POST Handler with Sequential Fallback
// Tries each configured provider in order. If a provider fails during the
// verification window, catches the error and tries the next one.
// -----------------------------------------------------------------------------

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();
    const systemPrompt = getSystemPrompt(body.mode || 'create');
    const contextPrefix = buildContextPrefix(body);
    const prompt = `${contextPrefix}Conversation history: ${JSON.stringify(body.messages)}`;

    const providers = getCachedProviderChain();
    const errors: string[] = [];

    for (let i = 0; i < providers.length; i++) {
      const provider = providers[i];
      const label = `${provider.name}/${provider.model}`;

      try {
        const response = await tryStreamWithProvider(provider, prompt, systemPrompt);
        return response;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`${label}: ${errorMsg}`);

        console.error(
          `[AI-PROVIDER] [${new Date().toISOString()}] [ERROR] Provider failed: ${label} — ${errorMsg}`
        );

        if (i < providers.length - 1) {
          console.log(
            `[AI-PROVIDER] [${new Date().toISOString()}] [INFO] Falling back → ${providers[i + 1].name}/${providers[i + 1].model}`
          );
        }
      }
    }

    // All providers failed
    console.error(`[AI-PROVIDER] [${new Date().toISOString()}] [ERROR] All ${providers.length} providers failed`);

    return new Response(
      JSON.stringify({
        error: 'All AI providers failed',
        details: errors.join(' | '),
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
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
