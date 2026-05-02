// =============================================================================
// Stepease - EDIT SECTION API ROUTE
// Modifies a specific section of an SOP based on user request
// Uses centralized sequential provider fallback with stream verification
// =============================================================================

import { streamTextWithFallback } from '@/lib/ai-fallback';
import { EDIT_SECTION_SYSTEM_PROMPT } from '@/lib/sop-system-prompt';

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

Modify the section above according to the user's request. 

## IMPORTANT INSTRUCTIONS:
- Perform a **SURGICAL** edit. 
- If the user asks to add something, ONLY add it. Do not rewrite or rephrase existing content.
- Maintain existing numbering sequences. If you add a step between 2 and 3, renumber 3 to 4, but do not change its text.
- If appropriate to maintain main step identity, use sub-numbering (e.g., 2a, 2b).
- Return ONLY the modified section body as Markdown (do NOT include the section header "## ${body.sectionTitle}").
- Do NOT use code blocks or conversational text.`;
}

// -----------------------------------------------------------------------------
// POST Handler
// Calls the centralized fallback utility for streaming text generation.
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

    return await streamTextWithFallback({
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.3,
    });
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
