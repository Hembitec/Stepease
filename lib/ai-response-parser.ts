// =============================================================================
// Stepease - AI RESPONSE PARSER
// Handles parsing and validation of AI responses
// =============================================================================

import {
    type AIResponse,
    type AIResponseNote,
    type Note,
    type ConversationPhase,
    isValidNoteCategory,
    isValidPhase,
    generateId,
    NOTE_CATEGORIES,
    aiResponseSchema,
} from './types'

// -----------------------------------------------------------------------------
// Constants & Mappings
// -----------------------------------------------------------------------------

const CATEGORY_ALIASES: Record<string, string> = {
    'HEADER': 'HEADER_INFO',
    'PURPOSE': 'PURPOSE_SCOPE',
    'SCOPE': 'PURPOSE_SCOPE',
    'ROLES': 'ROLES_RESPONSIBILITIES',
    'RESPONSIBILITIES': 'ROLES_RESPONSIBILITIES',
    'PROCEDURE': 'PROCEDURE_STEPS',
    'STEPS': 'PROCEDURE_STEPS',
    'DECISION': 'DECISION_POINTS',
    'QUALITY': 'QUALITY_SUCCESS',
    'SUCCESS': 'QUALITY_SUCCESS',
    'TROUBLESHOOT': 'TROUBLESHOOTING',
    'ERRORS': 'TROUBLESHOOTING',
    'DEFINITIONS': 'DEFINITIONS_REFERENCES',
    'REFERENCES': 'DEFINITIONS_REFERENCES',
    'GLOSSARY': 'DEFINITIONS_REFERENCES',
    'MATERIALS': 'MATERIALS_RESOURCES',
    'RESOURCES': 'MATERIALS_RESOURCES',
    'EQUIPMENT': 'MATERIALS_RESOURCES',
    'VISUAL': 'VISUAL_AIDS',
    'FLOWCHART': 'VISUAL_AIDS',
    'GAPS': 'GAPS_IMPROVEMENTS',
    'IMPROVEMENTS': 'GAPS_IMPROVEMENTS',
    'META': 'METADATA',
}

// -----------------------------------------------------------------------------
// Response Parsing
// -----------------------------------------------------------------------------

/**
 * Attempts to extract JSON from a string that may contain markdown code blocks
 */
function extractJSON(content: string): string {
    // Check for markdown code blocks
    const jsonBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonBlockMatch) {
        return jsonBlockMatch[1].trim()
    }

    // Check for raw JSON (starts with {)
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
        return jsonMatch[0]
    }

    return content
}

/**
 * Validates and normalizes note category using mapping and Zod
 */
function normalizeCategory(category: string): string {
    const normalized = category.toUpperCase().replace(/\s+/g, '_')
    return CATEGORY_ALIASES[normalized] || normalized
}

/**
 * Converts an AI response note to a full Note object
 */
function convertToNote(aiNote: AIResponseNote, messageNumber: number): Note {
    const normalizedCategory = normalizeCategory(aiNote.category)

    return {
        id: generateId('note'),
        category: isValidNoteCategory(normalizedCategory) ? normalizedCategory : 'METADATA',
        priority: aiNote.priority || 'medium',
        timestamp: `Message ${messageNumber}`,
        source: 'AI Extraction',
        content: aiNote.content || '',
        relatedTo: aiNote.relatedTo || '',
        action: aiNote.action || '',
    }
}

/**
 * Parses AI response into structured format
 * Handles JSON, partial JSON, and plain text responses
 */
export function parseAIResponse(
    content: string,
    messageNumber: number = 0
): {
    message: string
    notes: Note[]
    phase: ConversationPhase
    progress: number
    parseSuccess: boolean
} {
    const defaultResult = {
        message: content,
        notes: [],
        phase: 'foundation' as ConversationPhase,
        progress: 0,
        parseSuccess: false,
    }

    try {
        const jsonStr = extractJSON(content)
        const rawParsed = JSON.parse(jsonStr)

        // Use Zod for strict validation
        const result = aiResponseSchema.safeParse(rawParsed)

        if (!result.success) {
            // Fallback for partial objects if message exists
            if (rawParsed && typeof rawParsed.message === 'string') {
                return {
                    ...defaultResult,
                    message: rawParsed.message,
                    phase: isValidPhase(rawParsed.phase) ? rawParsed.phase : 'foundation',
                    progress: typeof rawParsed.progress === 'number' ? rawParsed.progress : 0,
                }
            }
            return defaultResult
        }

        const parsed = result.data

        return {
            message: parsed.message,
            notes: parsed.notes.map(n => convertToNote(n, messageNumber)),
            phase: parsed.phase,
            progress: parsed.progress,
            parseSuccess: true,
        }
    } catch {
        return defaultResult
    }
}

/**
 * Validates that an AI response has minimum required information
 */
export function validateAIResponse(response: AIResponse): {
    isValid: boolean
    errors: string[]
} {
    const errors: string[] = []

    if (!response.message || response.message.trim().length === 0) {
        errors.push('Response message is empty')
    }

    if (response.phase && !isValidPhase(response.phase)) {
        errors.push(`Invalid phase: ${response.phase}`)
    }

    if (response.progress < 0 || response.progress > 100) {
        errors.push(`Progress must be between 0 and 100, got: ${response.progress}`)
    }

    // Validate notes
    for (const note of response.notes || []) {
        const normalizedCategory = normalizeCategory(note.category)
        if (!isValidNoteCategory(normalizedCategory)) {
            errors.push(`Invalid note category: ${note.category}`)
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    }
}

/**
 * Gets the display message from a potentially JSON-encoded response
 */
export function getDisplayMessage(content: string): string {
    try {
        const jsonStr = extractJSON(content)
        const parsed = JSON.parse(jsonStr)
        return parsed.message || content
    } catch {
        return content
    }
}
