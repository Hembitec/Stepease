// =============================================================================
// Stepease - GENERATE SOP API ROUTE
// Transforms collected notes into a complete SOP document
// Supports both CREATE (new SOP) and IMPROVE (existing SOP) modes
// =============================================================================

import { streamText } from "ai"
import { google } from "@ai-sdk/google"
import type { Note, ChatMessage } from "@/lib/types"
import type { AnalysisResult } from "@/lib/sop-analyzer"

// Allow longer execution for document generation
export const maxDuration = 60

// -----------------------------------------------------------------------------
// SOP Generation System Prompt (for CREATE mode)
// -----------------------------------------------------------------------------

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

Generate a thorough, professional SOP that could be immediately used in a real organization.`

// -----------------------------------------------------------------------------
// SOP Improvement System Prompt (for IMPROVE mode)
// -----------------------------------------------------------------------------

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

Use tables where appropriate for clarity.`

// -----------------------------------------------------------------------------
// Helper: Organize Notes by Category
// -----------------------------------------------------------------------------

function organizeNotes(notes: Note[]): Record<string, Note[]> {
  const notesByCategory: Record<string, Note[]> = {}

  for (const note of notes) {
    const category = note.category || "OTHER"
    if (!notesByCategory[category]) {
      notesByCategory[category] = []
    }
    notesByCategory[category].push(note)
  }

  return notesByCategory
}

// -----------------------------------------------------------------------------
// Helper: Format Notes for Prompt
// -----------------------------------------------------------------------------

function formatNotesForPrompt(notesByCategory: Record<string, Note[]>): string {
  return Object.entries(notesByCategory)
    .map(([category, categoryNotes]) => {
      const formattedNotes = categoryNotes
        .map((n, i) => {
          let noteText = `  ${i + 1}. ${n.content}`
          if (n.relatedTo) noteText += ` (Related: ${n.relatedTo})`
          if (n.action) noteText += ` - Action: ${n.action}`
          return noteText
        })
        .join("\n")

      return `### ${category.replace(/_/g, " ")}\n${formattedNotes}`
    })
    .join("\n\n")
}

// -----------------------------------------------------------------------------
// Helper: Get Missing Sections from Structure
// -----------------------------------------------------------------------------

function getMissingSections(structure: AnalysisResult['structure']): string[] {
  const sectionMap: Record<string, boolean> = {
    'Header': structure.hasHeader,
    'Purpose': structure.hasPurpose,
    'Scope': structure.hasScope,
    'Roles': structure.hasRoles,
    'Definitions': structure.hasDefinitions,
    'References': structure.hasReferences,
    'Materials': structure.hasMaterials,
    'Procedures': structure.hasProcedures,
    'Quality': structure.hasQuality,
    'Troubleshooting': structure.hasTroubleshooting,
    'Appendices': structure.hasAppendices,
    'Revision': structure.hasRevision,
  }

  return Object.entries(sectionMap)
    .filter(([_, present]) => !present)
    .map(([section]) => section)
}

// -----------------------------------------------------------------------------
// Helper: Format Analysis for Prompt
// -----------------------------------------------------------------------------

function formatAnalysisForPrompt(analysis: AnalysisResult): string {
  const structure = analysis.structure
  const missingSections = getMissingSections(structure)

  const presentSections: string[] = []
  if (structure.hasHeader) presentSections.push('Header')
  if (structure.hasPurpose) presentSections.push('Purpose')
  if (structure.hasScope) presentSections.push('Scope')
  if (structure.hasRoles) presentSections.push('Roles')
  if (structure.hasDefinitions) presentSections.push('Definitions')
  if (structure.hasReferences) presentSections.push('References')
  if (structure.hasMaterials) presentSections.push('Materials')
  if (structure.hasProcedures) presentSections.push('Procedures')
  if (structure.hasQuality) presentSections.push('Quality')
  if (structure.hasTroubleshooting) presentSections.push('Troubleshooting')
  if (structure.hasAppendices) presentSections.push('Appendices')
  if (structure.hasRevision) presentSections.push('Revision')

  const strengthsList = analysis.strengths.map(s => `✓ ${s}`).join('\n')
  const issuesList = analysis.improvements.map(i =>
    `• [${i.priority}] ${i.category}: ${i.description}`
  ).join('\n')

  let result = `## Analysis Results
**Quality Score:** ${analysis.quality.overall}/100
**Completeness Score:** ${structure.completenessScore}%

### Strengths (PRESERVE THESE):
${strengthsList}

### Issues That Were Addressed:
${issuesList}

### Structure Analysis:
`

  if (presentSections.length > 0) {
    result += `**Present Sections:** ${presentSections.join(', ')}\n`
  }
  if (missingSections.length > 0) {
    result += `**Missing Sections (ADD THESE):** ${missingSections.join(', ')}\n`
  }

  return result
}

// -----------------------------------------------------------------------------
// Helper: Format Conversation for Prompt
// -----------------------------------------------------------------------------

function formatConversationForPrompt(messages: ChatMessage[]): string {
  // Filter to only include user and assistant messages (not system)
  const relevantMessages = messages.filter(m => m.role === 'user' || m.role === 'ai')

  if (relevantMessages.length === 0) {
    return "No improvement conversation available."
  }

  return relevantMessages
    .map(msg => `**${msg.role.toUpperCase()}:** ${msg.content}`)
    .join('\n\n')
}

// -----------------------------------------------------------------------------
// Build Improvement Prompt
// -----------------------------------------------------------------------------

function buildImprovementPrompt(
  originalContent: string,
  analysis: AnalysisResult | null,
  conversationHistory: ChatMessage[],
  notes: Note[],
  title: string
): string {
  const notesByCategory = organizeNotes(notes)
  const notesContext = formatNotesForPrompt(notesByCategory)

  let prompt = `# TASK: Improve Existing SOP

**SOP Title:** ${title}

`

  // Add original SOP content
  prompt += `## ORIGINAL SOP CONTENT
=== START OF ORIGINAL ===
${originalContent}
=== END OF ORIGINAL ===

`

  // Add analysis results if available
  if (analysis) {
    prompt += formatAnalysisForPrompt(analysis)
    prompt += '\n\n'
  }

  // Add conversation history
  prompt += `## IMPROVEMENT CONVERSATION
The following conversation was had to gather information for improvements:

${formatConversationForPrompt(conversationHistory)}

`

  // Add extracted notes
  prompt += `## EXTRACTED NOTES FROM CONVERSATION
These notes contain specific information to incorporate:

${notesContext}

`

  // Build missing sections string
  const missingSectionsStr = analysis
    ? getMissingSections(analysis.structure).join(', ')
    : ''

  // Add specific instructions
  prompt += `## YOUR TASK
Generate an IMPROVED version of the SOP that:

1. **PRESERVES all existing good content** - The original SOP has strengths, keep them
2. **ADDS missing sections** identified in the analysis${missingSectionsStr ? `: ${missingSectionsStr}` : ''}
3. **INCORPORATES information from the notes** - Use the extracted notes to fill gaps
4. **MAINTAINS the original tone and style** - Don't unnecessarily rewrite good content
5. **Updates the version number** - Increment to show this is an improved version

IMPORTANT: This is an improvement, not a rewrite. The goal is to enhance the existing SOP while preserving its strengths.

Generate the complete improved SOP now in Markdown format:`

  return prompt
}

// -----------------------------------------------------------------------------
// Build Create Prompt
// -----------------------------------------------------------------------------

function buildCreatePrompt(notes: Note[], title: string, description?: string): string {
  const notesByCategory = organizeNotes(notes)
  const notesContext = formatNotesForPrompt(notesByCategory)

  return `Generate a complete SOP document based on these conversation notes:

${title ? `**SOP Title:** ${title}` : ""}
${description ? `**Description:** ${description}` : ""}

## Collected Information:

${notesContext}

Please generate a comprehensive, well-structured SOP document in Markdown format following the standard SOP template. Make sure to:
1. Fill in all sections based on the notes provided
2. Infer reasonable details where information might be missing
3. Use professional language appropriate for an official document
4. Include placeholder markers [TBD] for any critical information that couldn't be determined
5. Add helpful notes and warnings where appropriate`
}

// -----------------------------------------------------------------------------
// POST Handler
// -----------------------------------------------------------------------------

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Extract all possible fields
    const {
      mode = 'create',
      notes = [],
      title = 'Standard Operating Procedure',
      description,
      originalContent,
      analysis,
      conversationHistory = []
    } = body as {
      mode?: 'create' | 'improve'
      notes: Note[]
      title?: string
      description?: string
      originalContent?: string
      analysis?: AnalysisResult
      conversationHistory?: ChatMessage[]
    }

    let systemPrompt: string
    let userPrompt: string

    if (mode === 'improve' && originalContent) {
      // IMPROVEMENT MODE: Use full context
      console.log('Generating improved SOP with full context...')
      console.log(`- Original content length: ${originalContent.length} chars`)
      console.log(`- Analysis available: ${!!analysis}`)
      console.log(`- Conversation messages: ${conversationHistory.length}`)
      console.log(`- Notes collected: ${notes.length}`)

      systemPrompt = IMPROVE_SOP_SYSTEM_PROMPT
      userPrompt = buildImprovementPrompt(
        originalContent,
        analysis || null,
        conversationHistory,
        notes,
        title
      )
    } else {
      // CREATE MODE: Generate from notes only
      console.log('Generating new SOP from notes...')
      console.log(`- Notes collected: ${notes.length}`)

      systemPrompt = CREATE_SOP_SYSTEM_PROMPT
      userPrompt = buildCreatePrompt(notes, title, description)
    }

    // Stream the response
    const result = streamText({
      model: google("gemini-3-flash-preview"),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.3, // Lower temperature for more consistent output
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Generate SOP API Error:", error)

    return new Response(
      JSON.stringify({
        error: "Failed to generate SOP",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    )
  }
}
