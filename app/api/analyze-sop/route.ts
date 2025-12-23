
import { processPDF, processWord, processText, type ProcessedFile } from "@/lib/file-processors"
import { analyzeSOPText } from "@/lib/sop-analyzer"

export const maxDuration = 60 // Allow up to 60 seconds for processing

export async function POST(req: Request) {
    try {
        const formData = await req.formData()
        const file = formData.get("file") as File

        if (!file) {
            return new Response("No file provided", { status: 400 })
        }

        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Process file based on type
        let processedFile: ProcessedFile

        if (file.type === "application/pdf") {
            processedFile = await processPDF(buffer)
        } else if (
            file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            file.name.endsWith(".docx")
        ) {
            processedFile = await processWord(buffer)
        } else if (file.type === "text/plain" || file.name.endsWith(".md") || file.name.endsWith(".txt")) {
            processedFile = await processText(buffer)
        } else {
            return new Response("Unsupported file type", { status: 400 })
        }

        // Analyze content
        const analysis = await analyzeSOPText(processedFile.content)

        return Response.json({
            processedFile,
            analysis
        })

    } catch (error) {
        console.error("Analysis API Error:", error)
        return new Response(
            JSON.stringify({
                error: "Failed to process file",
                details: error instanceof Error ? error.message : "Unknown error"
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        )
    }
}
