
import mammoth from "mammoth"
import { extractTextFromPDF } from "./pdf-extraction-client"

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
 * Process a PDF file buffer to extract text using external API
 */
export async function processPDF(buffer: Buffer): Promise<ProcessedFile> {
    try {
        // Use external PDF extraction API
        const result = await extractTextFromPDF(buffer)
        const content = cleanText(result.text)

        return {
            content,
            metadata: {
                charCount: content.length,
                wordCount: content.split(/\s+/).filter(w => w.length > 0).length,
            }
        }
    } catch (error) {
        console.error("PDF Processing Error:", error)
        throw new Error(
            error instanceof Error
                ? error.message
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
