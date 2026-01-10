
import mammoth from "mammoth"

export interface ProcessedFile {
    content: string
    metadata: {
        pageCount?: number
        charCount: number
        wordCount: number
        title?: string
    }
}

/**
 * Clean text by removing excessive whitespace and normalizing content
 */
function cleanText(text: string): string {
    return text
        .replace(/\r\n/g, "\n")
        .replace(/\t/g, "  ")
        .replace(/\n{3,}/g, "\n\n") // Max 2 newlines
        .trim()
}

/**
 * Process a PDF file buffer to extract text using pdf-parse v1.x
 * Note: We use dynamic require to avoid the test file loading bug in pdf-parse
 */
export async function processPDF(buffer: Buffer): Promise<ProcessedFile> {
    try {
        // Use the lib directly to avoid index.js which has the test file bug
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfParse = require("pdf-parse/lib/pdf-parse.js")
        const data = await pdfParse(buffer)
        const content = cleanText(data.text)

        return {
            content,
            metadata: {
                pageCount: data.numpages,
                charCount: content.length,
                wordCount: content.split(/\s+/).filter((w: string) => w.length > 0).length,
                title: data.info?.Title || undefined
            }
        }
    } catch (error) {
        console.error("PDF Processing Error:", error)
        throw new Error(
            error instanceof Error
                ? `Failed to process PDF: ${error.message}`
                : "Failed to process PDF file"
        )
    }
}


/**
 * Process a Word document buffer to extract text
 */
export async function processWord(buffer: Buffer): Promise<ProcessedFile> {
    try {
        const result = await mammoth.extractRawText({ buffer })
        const content = cleanText(result.value)

        return {
            content,
            metadata: {
                charCount: content.length,
                wordCount: content.split(/\s+/).length
            }
        }
    } catch (error) {
        console.error("Word Processing Error:", error)
        throw new Error("Failed to process Word document")
    }
}

/**
 * Process a plain text file buffer
 */
export async function processText(buffer: Buffer): Promise<ProcessedFile> {
    try {
        const content = cleanText(buffer.toString("utf-8"))

        return {
            content,
            metadata: {
                charCount: content.length,
                wordCount: content.split(/\s+/).length
            }
        }
    } catch (error) {
        console.error("Text Processing Error:", error)
        throw new Error("Failed to process text file")
    }
}
