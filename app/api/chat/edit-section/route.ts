// =============================================================================
// Stepease - EDIT SECTION API ROUTE
// Modifies a specific section of an SOP based on user request
// Uses multi-provider fallback with streaming verification
// =============================================================================

import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { getCachedProviderChain } from '@/lib/ai-fallback';
import { EDIT_SECTION_SYSTEM_PROMPT } from '@/lib/sop-system-prompt';
import { ProviderConfig } from '@/lib/ai-types';

export const maxDuration = 60;

interface RequestBody {
  sectionTitle: string;
  sectionContent: string;
  fullSopContent: string;
  userPrompt: string;
  sopTitle?: string;
}

function buildEditSectionPrompt(body: RequestBody): string {
  return `# TASK: Edit SOP Section

**SOP Title:** ${body.sopTitle || 'Standard Operating Procedure'}
**Section Being Edited:** ${body.sectionTitle}

## CURRENT SECTION CONTENT
=== START OF SECTION ===
${body.sectionContent}
=== END OF SECTION ===

## FULL SOP DOCUMENT (for context)
=== START OF FULL SOP ===
${body.fullSopContent}
=== END OF FULL SOP ===

## USER'S REQUEST
${body.userPrompt}

Modify the section above according to the user's request. Return ONLY the modified section content as Markdown (without the section header).`;
}

// -----------------------------------------------------------------------------
// Provider Instance Factory
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
// Races result.text against a timeout to verify the provider works,
// then returns the SDK's native response format.
// -----------------------------------------------------------------------------

async function tryStreamWithProvider(
  provider: ProviderConfig,
  systemPrompt: string,
  userPrompt: string,
): Promise<Response> {
  const label = `${provider.name}/${provider.model}`;

  console.log(`[AI-PROVIDER] [${new Date().toISOString()}] [INFO] Trying provider: ${label}`);

  const result = streamText({
    model: getModelInstance(provider),
    system: systemPrompt,
    prompt: userPrompt,
    temperature: 0.3,
  });

  // Race: wait for either result.text to reject (provider error) or 5s timeout
  const VERIFICATION_TIMEOUT_MS = 5000;

  await Promise.race([
    result.text.then(
      () => { /* resolved = stream completed fully */ },
      (err) => { throw err; } // re-throw to trigger fallback
    ),
    new Promise<void>((resolve) => setTimeout(resolve, VERIFICATION_TIMEOUT_MS)),
  ]);

  console.log(`[AI-PROVIDER] [${new Date().toISOString()}] [INFO] Provider accepted: ${label}`);

  return result.toTextStreamResponse();
}

// -----------------------------------------------------------------------------
// POST Handler with Sequential Fallback
// -----------------------------------------------------------------------------

export async function POST(req: Request) {
  try {
    const body = await req.json() as RequestBody;

    // Validate required fields
    if (!body.sectionTitle?.trim()) {
      return new Response(
        JSON.stringify({ error: 'sectionTitle is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!body.sectionContent?.trim()) {
      return new Response(
        JSON.stringify({ error: 'sectionContent is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!body.userPrompt?.trim()) {
      return new Response(
        JSON.stringify({ error: 'userPrompt is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Size limit check (200KB total to prevent token limit issues)
    const totalSize = (body.sectionContent?.length || 0) +
                      (body.fullSopContent?.length || 0) +
                      (body.userPrompt?.length || 0);
    if (totalSize > 200000) {
      return new Response(
        JSON.stringify({ error: 'Content too large. Maximum 200KB total.' }),
        { status: 413, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = EDIT_SECTION_SYSTEM_PROMPT;
    const userPrompt = buildEditSectionPrompt(body);

    const providers = getCachedProviderChain();
    const errors: string[] = [];

    for (let i = 0; i < providers.length; i++) {
      const provider = providers[i];
      const label = `${provider.name}/${provider.model}`;

      try {
        const response = await tryStreamWithProvider(provider, systemPrompt, userPrompt);
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
        error: 'Failed to edit section',
        details: errors.join(' | '),
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[AI-PROVIDER] Edit Section API Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return new Response(
      JSON.stringify({
        error: 'Failed to edit section',
        details: errorMessage,
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
