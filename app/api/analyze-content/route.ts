
import { analyzeSOPText } from "@/lib/sop-analyzer"

export const maxDuration = 60

export async function POST(req: Request) {
    try {
        const { content } = await req.json()

        if (!content || typeof content !== "string") {
            return Response.json(
                { error: "No content provided for analysis" },
                { status: 400 }
            )
        }

        const analysis = await analyzeSOPText(content)

        return Response.json({
            analysis,
            success: true
        })

    } catch (error) {
        console.error("ANALYSIS Error:", error)

        const errorMessage = error instanceof Error ? error.message : "Unknown error"

        return Response.json(
            {
                error: "Failed to analyze the SOP content. Please try again.",
                details: errorMessage
            },
            { status: 500 }
        )
    }
}
