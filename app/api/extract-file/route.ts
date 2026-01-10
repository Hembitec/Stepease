
import { processPDF, processWord, processText, type ProcessedFile } from "@/lib/file-processors"

export const maxDuration = 30

export async function POST(req: Request) {
    try {
        const formData = await req.formData()
        const file = formData.get("file") as File

        if (!file) {
            return Response.json(
                { error: "No file provided" },
                { status: 400 }
            )
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
            return Response.json(
                { error: "Unsupported file type" },
                { status: 400 }
            )
        }

        return Response.json({
            processedFile,
            success: true
        })

    } catch (error) {
        console.error("EXTRACTION Error:", error)

        const errorMessage = error instanceof Error ? error.message : "Unknown error"

        return Response.json(
            {
                error: "Failed to extract text from your file. Please check the file format.",
                details: errorMessage
            },
            { status: 500 }
        )
    }
}
