// =============================================================================
// Stepease - SOP CHAT API ROUTE
// Handles conversational AI for SOP creation and improvement
// =============================================================================

import { streamObject } from "ai"
import { google } from "@ai-sdk/google"
import { SOP_SYSTEM_PROMPT, IMPROVE_SOP_SYSTEM_PROMPT } from "@/lib/sop-system-prompt"
import { aiResponseSchema } from "@/lib/types"

// Allow longer execution for complex responses
export const maxDuration = 60

// -----------------------------------------------------------------------------
// POST Handler
// -----------------------------------------------------------------------------

interface RequestBody {
  messages: any[]
  mode?: string
  analysisContext?: {
    summary: string
    strengths: string[]
    improvements: Array<{
      category: string
      priority: string
      description: string
      suggestion: string
    }>
    quality: {
      overall: number
    }
  }
}

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json()
    const { messages, mode = "create", analysisContext } = body

    // Select appropriate system prompt
    const systemPrompt = mode === "improve"
      ? IMPROVE_SOP_SYSTEM_PROMPT
      : SOP_SYSTEM_PROMPT

    // Build context for improvement mode
    let contextPrefix = ""
    if (mode === "improve" && analysisContext) {
      contextPrefix = `
ANALYSIS CONTEXT (from prior analysis):
- Overall Quality Score: ${analysisContext.quality.overall}/100
- Summary: ${analysisContext.summary}
- Strengths: ${analysisContext.strengths.join(", ")}
- Improvements needed (in priority order):
${analysisContext.improvements.map((imp, i) =>
        `  ${i + 1}. [${imp.priority.toUpperCase()}] ${imp.description}`
      ).join("\n")}

Continue helping the user address these improvements one by one, starting with HIGH priority.

`
    }

    // Stream the response as a structured object
    const result = streamObject({
      model: google("gemini-3-flash-preview"),
      system: systemPrompt,
      schema: aiResponseSchema,
      prompt: `${contextPrefix}Conversation history: ${JSON.stringify(messages)}`,
      temperature: 0.2,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("SOP Chat API Error:", error)

    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    )
  }
}
