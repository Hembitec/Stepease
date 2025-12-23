
import mammoth from "mammoth"
import { PDFParse } from "pdf-parse"

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
 * Process a PDF file buffer to extract text
 */
export async function processPDF(buffer: Buffer): Promise<ProcessedFile> {
    try {
        // Create PDFParse instance with the buffer data
        const pdfParser = new PDFParse({ data: buffer })

        // Extract text and info from the PDF
        const textResult = await pdfParser.getText()
        const infoResult = await pdfParser.getInfo()

        const content = cleanText(textResult.text)

        // Clean up resources
        await pdfParser.destroy()

        return {
            content,
            metadata: {
                pageCount: infoResult.total,
                charCount: content.length,
                wordCount: content.split(/\s+/).length,
                title: infoResult.info?.Title as string | undefined
            }
        }
    } catch (error) {
        console.error("PDF Processing Error:", error)
        throw new Error("Failed to process PDF file")
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
