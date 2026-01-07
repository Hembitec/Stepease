// =============================================================================
// PDF Extraction API Client
// Handles communication with the external PDF extraction service
// =============================================================================

const PDF_EXTRACTION_API_URL = process.env.PDF_EXTRACTION_API_URL ||
    "https://pdf-extraction-apis.onrender.com/extract-pdf"

export interface PDFExtractionResult {
    text: string
    characters: number
}

export interface PDFExtractionError {
    error: string
}

/**
 * Extracts text content from a PDF buffer using the external API
 * @param buffer - PDF file content as a Buffer
 * @returns Extracted text and character count
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<PDFExtractionResult> {
    // Convert buffer to base64
    const base64Content = buffer.toString("base64")

    try {
        const response = await fetch(PDF_EXTRACTION_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ pdf: base64Content }),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})) as PDFExtractionError
            const errorMessage = errorData.error || `API returned status ${response.status}`
            throw new Error(`PDF extraction failed: ${errorMessage}`)
        }

        const data = await response.json() as PDFExtractionResult

        if (!data.text && data.text !== "") {
            throw new Error("API response missing 'text' field")
        }

        return {
            text: data.text,
            characters: data.characters || data.text.length,
        }
    } catch (error) {
        if (error instanceof Error) {
            // Re-throw with additional context if needed
            if (error.message.includes("PDF extraction failed")) {
                throw error
            }
            throw new Error(`Failed to extract PDF text: ${error.message}`)
        }
        throw new Error("Failed to extract PDF text: Unknown error")
    }
}
