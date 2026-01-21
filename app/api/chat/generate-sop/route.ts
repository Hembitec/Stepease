// =============================================================================
// Stepease - GENERATE SOP API ROUTE
// Transforms collected notes into a complete SOP document
// Supports both CREATE (new SOP) and IMPROVE (existing SOP) modes
// Uses multi-provider fallback system for reliability
// =============================================================================

import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { streamWithFallback, getCachedProviderChain } from '@/lib/ai-fallback';
import type { Note, ChatMessage } from '@/lib/types';
import type { AnalysisResult } from '@/lib/sop-analyzer';
import { ProviderConfig } from '@/lib/ai-types';

export const maxDuration = 60;

const CREATE_SOP_SYSTEM_PROMPT = `You are an expert technical writer specializing in creating comprehensive Standard Operating Procedures (SOPs). Your task is to generate a complete, professional SOP document from the provided conversation notes.

## Output Format
Generate the SOP in clean Markdown format with the following structure:

# [SOP Title]

**Document ID:** SOP-[CATEGORY]-[NUMBER]
**Version:** 1.0
**Effective Date:** [Current Date]
**Last Reviewed:** [Current Date]
**Document Owner:** [From notes or "To be assigned"]
**Approved By:** [From notes or "Pending approval"]

---

## 1. Purpose
[Clear statement of why this procedure exists and what it accomplishes]

## 2. Scope
[Define what/who this SOP applies to and any exclusions]

## 3. Responsibilities
[List each role and their specific responsibilities in a table format]

| Role | Responsibilities |
|------|-----------------|
| [Role 1] | [Responsibilities] |

## 4. Definitions
[Define key terms, acronyms, or technical language used]

## 5. Procedure

### 5.1 [First Major Step]
**Prerequisites:** [If any]
1. [Detailed sub-step]
2. [Detailed sub-step]

**Note:** [Important considerations]

### 5.2 [Second Major Step]
[Continue pattern...]

## 6. Quality Metrics & Success Criteria
[Measurable outcomes and KPIs]

## 7. Troubleshooting
[Common issues and resolutions in a table]

| Issue | Possible Cause | Resolution |
|-------|---------------|------------|
| [Issue 1] | [Cause] | [Fix] |

## 8. Related Documents
[Links to related SOPs, forms, templates]

## 9. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [Date] | [Author] | Initial release |

---

## Writing Guidelines:
1. Use clear, action-oriented language (imperative mood)
2. One action per step
3. Include warnings/cautions where safety is concerned
4. Be specific with quantities, timeframes, and measurements
5. Avoid jargon unless defined
6. Include decision points with clear criteria
7. Add visual aids placeholders where helpful: [DIAGRAM: description]

Generate a thorough, professional SOP that could be immediately used in a real organization.`;

const IMPROVE_SOP_SYSTEM_PROMPT = `You are an expert SOP editor and technical writer. Your task is to IMPROVE an existing SOP by:
1. PRESERVING all the good content from the original
2. ADDING new sections to fill gaps identified in the analysis
3. INCORPORATING information gathered from the improvement conversation
4. MAINTAINING the original tone, style, and quality

## CRITICAL RULES:
- This is an IMPROVEMENT task, NOT a complete rewrite
- Keep approximately 70-80% of the original content intact
- Only enhance or add what's necessary based on the analysis and conversation
- Respect the original author's voice and style
- Preserve all strengths identified in the analysis

## Output Format:
Generate the improved SOP in clean Markdown format. Include all standard SOP sections:
- Header (title, version, date, author)
- Purpose
- Scope  
- Roles & Responsibilities
- Definitions (if needed)
- References
- Materials & Resources (if applicable)
- Procedure
- Quality Checks
- Troubleshooting
- Appendices (if applicable)
- Revision History

Use tables where appropriate for clarity.`;

function organizeNotes(notes: Note[]): Record<string, Note[]> {
  const notesByCategory: Record<string, Note[]> = {};

  for (const note of notes) {
    const category = note.category || 'OTHER';
    if (!notesByCategory[category]) {
      notesByCategory[category] = [];
    }
    notesByCategory[category].push(note);
  }

  return notesByCategory;
}

function formatNotesForPrompt(notesByCategory: Record<string, Note[]>): string {
  return Object.entries(notesByCategory)
    .map(([category, categoryNotes]) => {
      const formattedNotes = categoryNotes
        .map((n, i) => {
          let noteText = `  ${i + 1}. ${n.content}`;
          if (n.relatedTo) noteText += ` (Related: ${n.relatedTo})`;
          if (n.action) noteText += ` - Action: ${n.action}`;
          return noteText;
        })
        .join('\n');

      return `### ${category.replace(/_/g, ' ')}\n${formattedNotes}`;
    })
    .join('\n\n');
}

function getMissingSections(structure: AnalysisResult['structure']): string[] {
  const sectionMap: Record<string, boolean> = {
    Header: structure.hasHeader,
    Purpose: structure.hasPurpose,
    Scope: structure.hasScope,
    Roles: structure.hasRoles,
    Definitions: structure.hasDefinitions,
    References: structure.hasReferences,
    Materials: structure.hasMaterials,
    Procedures: structure.hasProcedures,
    Quality: structure.hasQuality,
    Troubleshooting: structure.hasTroubleshooting,
    Appendices: structure.hasAppendices,
    Revision: structure.hasRevision,
  };

  return Object.entries(sectionMap)
    .filter(([, present]) => !present)
    .map(([section]) => section);
}

function formatAnalysisForPrompt(analysis: AnalysisResult): string {
  const structure = analysis.structure;
  const missingSections = getMissingSections(structure);

  const presentSections: string[] = [];
  if (structure.hasHeader) presentSections.push('Header');
  if (structure.hasPurpose) presentSections.push('Purpose');
  if (structure.hasScope) presentSections.push('Scope');
  if (structure.hasRoles) presentSections.push('Roles');
  if (structure.hasDefinitions) presentSections.push('Definitions');
  if (structure.hasReferences) presentSections.push('References');
  if (structure.hasMaterials) presentSections.push('Materials');
  if (structure.hasProcedures) presentSections.push('Procedures');
  if (structure.hasQuality) presentSections.push('Quality');
  if (structure.hasTroubleshooting) presentSections.push('Troubleshooting');
  if (structure.hasAppendices) presentSections.push('Appendices');
  if (structure.hasRevision) presentSections.push('Revision');

  const strengthsList = analysis.strengths.map((s) => `✓ ${s}`).join('\n');
  const issuesList = analysis.improvements.map(
    (i) => `• [${i.priority}] ${i.category}: ${i.description}`
  ).join('\n');

  let result = `## Analysis Results
**Quality Score:** ${analysis.quality.overall}/100
**Completeness Score:** ${structure.completenessScore}%

### Strengths (PRESERVE THESE):
${strengthsList}

### Issues That Were Addressed:
${issuesList}

### Structure Analysis:
`;

  if (presentSections.length > 0) {
    result += `**Present Sections:** ${presentSections.join(', ')}\n`;
  }
  if (missingSections.length > 0) {
    result += `**Missing Sections (ADD THESE):** ${missingSections.join(', ')}\n`;
  }

  return result;
}

function formatConversationForPrompt(messages: ChatMessage[]): string {
  const relevantMessages = messages.filter((m) => m.role === 'user' || m.role === 'ai');

  if (relevantMessages.length === 0) {
    return 'No improvement conversation available.';
  }

  return relevantMessages
    .map((msg) => `**${msg.role.toUpperCase()}:** ${msg.content}`)
    .join('\n\n');
}

function buildImprovementPrompt(
  originalContent: string,
  analysis: AnalysisResult | null,
  conversationHistory: ChatMessage[],
  notes: Note[],
  title: string
): string {
  const notesByCategory = organizeNotes(notes);
  const notesContext = formatNotesForPrompt(notesByCategory);

  // Format the current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let prompt = `# TASK: Improve Existing SOP

**Today's Date:** ${currentDate}
**SOP Title:** ${title}

`;

  prompt += `## ORIGINAL SOP CONTENT
=== START OF ORIGINAL ===
${originalContent}
=== END OF ORIGINAL ===

`;

  if (analysis) {
    prompt += formatAnalysisForPrompt(analysis);
    prompt += '\n\n';
  }

  prompt += `## IMPROVEMENT CONVERSATION
The following conversation was had to gather information for improvements:

${formatConversationForPrompt(conversationHistory)}

`;

  prompt += `## EXTRACTED NOTES FROM CONVERSATION
These notes contain specific information to incorporate:

${notesContext}

`;

  const missingSectionsStr = analysis ? getMissingSections(analysis.structure).join(', ') : '';

  prompt += `## YOUR TASK
Generate an IMPROVED version of the SOP that:

1. **PRESERVES all existing good content** - The original SOP has strengths, keep them
2. **ADDS missing sections** identified in the analysis${missingSectionsStr ? `: ${missingSectionsStr}` : ''}
3. **INCORPORATES information from the notes** - Use the extracted notes to fill gaps
4. **MAINTAINS the original tone and style** - Don't unnecessarily rewrite good content
5. **Updates the version number** - Increment to show this is an improved version

IMPORTANT: This is an improvement, not a rewrite. The goal is to enhance the existing SOP while preserving its strengths.

Generate the complete improved SOP now in Markdown format:`;

  return prompt;
}

function buildCreatePrompt(notes: Note[], title: string, description?: string): string {
  const notesByCategory = organizeNotes(notes);
  const notesContext = formatNotesForPrompt(notesByCategory);

  // Format the current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `Generate a complete SOP document based on these conversation notes:

**Today's Date:** ${currentDate}
${title ? `**SOP Title:** ${title}` : ''}
${description ? `**Description:** ${description}` : ''}

## Collected Information:

${notesContext}

Please generate a comprehensive, well-structured SOP document in Markdown format following the standard SOP template. Make sure to:
1. Fill in all sections based on the notes provided
2. Infer reasonable details where information might be missing
3. Use professional language appropriate for an official document
4. Include placeholder markers [TBD] for any critical information that couldn't be determined
5. Add helpful notes and warnings where appropriate
6. Use today's date (${currentDate}) for the Effective Date, Last Reviewed, and Revision History`;
}

interface RequestBody {
  mode?: 'create' | 'improve';
  notes?: Note[];
  title?: string;
  description?: string;
  originalContent?: string;
  analysis?: AnalysisResult;
  conversationHistory?: ChatMessage[];
}

function createStreamFunctions(
  body: RequestBody,
  providers: ProviderConfig[]
): Array<() => Promise<Response>> {
  const providerCache = new Map<string, any>();

  return providers.map((provider) => {
    return async () => {
      let systemPrompt: string;
      let userPrompt: string;

      if (body.mode === 'improve' && body.originalContent) {
        systemPrompt = IMPROVE_SOP_SYSTEM_PROMPT;
        userPrompt = buildImprovementPrompt(
          body.originalContent,
          body.analysis || null,
          body.conversationHistory || [],
          body.notes || [],
          body.title || 'Standard Operating Procedure'
        );
      } else {
        systemPrompt = CREATE_SOP_SYSTEM_PROMPT;
        userPrompt = buildCreatePrompt(
          body.notes || [],
          body.title || 'Standard Operating Procedure',
          body.description
        );
      }

      // Google Provider
      if (provider.name === 'google') {
        let googleProvider = providerCache.get(provider.name);
        if (!googleProvider) {
          googleProvider = createGoogleGenerativeAI({
            apiKey: provider.apiKey,
          });
          providerCache.set(provider.name, googleProvider);
        }

        const result = streamText({
          model: googleProvider(provider.model),
          system: systemPrompt,
          prompt: userPrompt,
          temperature: 0.3,
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

        const result = streamText({
          model: groqProvider(provider.model),
          system: systemPrompt,
          prompt: userPrompt,
          temperature: 0.3,
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

        const result = streamText({
          model: openaiCompatible(provider.model) as any,
          system: systemPrompt,
          prompt: userPrompt,
          temperature: 0.3,
        });
        return result.toTextStreamResponse();
      }
    };
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as RequestBody;

    const providers = getCachedProviderChain();
    const streamFunctions = createStreamFunctions(body, providers);

    const { response } = await streamWithFallback(streamFunctions, providers);

    return response;
  } catch (error) {
    console.error('[AI-PROVIDER] Generate SOP API Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return new Response(
      JSON.stringify({
        error: 'Failed to generate SOP',
        details: errorMessage,
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
