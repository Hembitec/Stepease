// =============================================================================
// STEPWISE - GENERATE SOP API ROUTE
// Transforms collected notes into a complete SOP document
// =============================================================================

import { streamText } from "ai"
import { google } from "@ai-sdk/google"
import type { Note } from "@/lib/types"

// Allow longer execution for document generation
export const maxDuration = 60

// -----------------------------------------------------------------------------
// SOP Generation System Prompt
// -----------------------------------------------------------------------------

const GENERATE_SOP_SYSTEM_PROMPT = `You are an expert technical writer specializing in creating comprehensive Standard Operating Procedures (SOPs). Your task is to generate a complete, professional SOP document from the provided conversation notes.

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
// POST Handler
// -----------------------------------------------------------------------------

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { notes, title, description } = body as {
      notes: Note[]
      title?: string
      description?: string
    }

    // Organize notes by category
    const notesByCategory = organizeNotes(notes)

    // Build the prompt with organized notes
    const notesContext = formatNotesForPrompt(notesByCategory)

    const userPrompt = `Generate a complete SOP document based on these conversation notes:

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

    // Stream the response
    const result = streamText({
      model: google("gemini-3-flash-preview"),
      system: GENERATE_SOP_SYSTEM_PROMPT,
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
