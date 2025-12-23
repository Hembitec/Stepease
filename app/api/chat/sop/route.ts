// =============================================================================
// STEPWISE - SOP CHAT API ROUTE
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

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages, mode = "create" }: { messages: any[]; mode?: string } = body

    // Select appropriate system prompt
    const systemPrompt = mode === "improve"
      ? IMPROVE_SOP_SYSTEM_PROMPT
      : SOP_SYSTEM_PROMPT

    // Stream the response as a structured object
    const result = streamObject({
      model: google("gemini-3-flash-preview"),
      system: systemPrompt,
      schema: aiResponseSchema,
      prompt: `Continuing conversation with user. History: ${JSON.stringify(messages)}`,
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
