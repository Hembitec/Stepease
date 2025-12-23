// =============================================================================
// STEPWISE - TYPE DEFINITIONS
// Core types for the SOP Builder application
// =============================================================================

import { z } from "zod"

// -----------------------------------------------------------------------------
// Note Categories - 12 categories as specified in aisop.md
// -----------------------------------------------------------------------------

export const NOTE_CATEGORIES = {
    HEADER_INFO: 'HEADER_INFO',
    PURPOSE_SCOPE: 'PURPOSE_SCOPE',
    ROLES_RESPONSIBILITIES: 'ROLES_RESPONSIBILITIES',
    PROCEDURE_STEPS: 'PROCEDURE_STEPS',
    DECISION_POINTS: 'DECISION_POINTS',
    QUALITY_SUCCESS: 'QUALITY_SUCCESS',
    TROUBLESHOOTING: 'TROUBLESHOOTING',
    DEFINITIONS_REFERENCES: 'DEFINITIONS_REFERENCES',
    MATERIALS_RESOURCES: 'MATERIALS_RESOURCES',
    VISUAL_AIDS: 'VISUAL_AIDS',
    GAPS_IMPROVEMENTS: 'GAPS_IMPROVEMENTS',
    METADATA: 'METADATA',
    OTHER: 'OTHER',
} as const

export type NoteCategory = keyof typeof NOTE_CATEGORIES

export const noteCategorySchema = z.enum([
    'HEADER_INFO',
    'PURPOSE_SCOPE',
    'ROLES_RESPONSIBILITIES',
    'PROCEDURE_STEPS',
    'DECISION_POINTS',
    'QUALITY_SUCCESS',
    'TROUBLESHOOTING',
    'DEFINITIONS_REFERENCES',
    'MATERIALS_RESOURCES',
    'VISUAL_AIDS',
    'GAPS_IMPROVEMENTS',
    'METADATA',
    'OTHER',
])

export const conversationPhaseSchema = z.enum([
    'foundation',
    'process',
    'accountability',
    'quality',
    'finalization',
    'complete',
])

export const aiResponseNoteSchema = z.object({
    category: z.string(),
    priority: z.enum(['high', 'medium', 'low']),
    content: z.string(),
    relatedTo: z.string(),
    action: z.string(),
})

export const aiResponseSchema = z.object({
    message: z.string(),
    notes: z.array(aiResponseNoteSchema),
    phase: conversationPhaseSchema,
    progress: z.number().min(0).max(100),
})

// -----------------------------------------------------------------------------
// Conversation Phases - 5-phase system from aisop.md
// -----------------------------------------------------------------------------

export const CONVERSATION_PHASES = {
    foundation: {
        name: 'Foundation',
        description: 'Basic information gathering',
        targetQuestions: 7,
        order: 1,
    },
    process: {
        name: 'Process Discovery',
        description: 'Mapping step-by-step procedures',
        targetQuestions: 15,
        order: 2,
    },
    accountability: {
        name: 'Accountability',
        description: 'Roles and responsibilities',
        targetQuestions: 8,
        order: 3,
    },
    quality: {
        name: 'Risk & Quality',
        description: 'Error handling and metrics',
        targetQuestions: 8,
        order: 4,
    },
    finalization: {
        name: 'Finalization',
        description: 'Final details and review',
        targetQuestions: 5,
        order: 5,
    },
    complete: {
        name: 'Complete',
        description: 'Ready for generation',
        targetQuestions: 0,
        order: 6,
    },
} as const

export type ConversationPhase = keyof typeof CONVERSATION_PHASES

// -----------------------------------------------------------------------------
// Note Interface - Enhanced to match aisop.md specification
// -----------------------------------------------------------------------------

export interface Note {
    id: string
    category: NoteCategory
    priority: 'high' | 'medium' | 'low'
    timestamp: string
    source: 'User Response' | 'AI Extraction' | 'AI Suggestion' | 'Manual'
    content: string
    relatedTo: string // Which SOP section this maps to
    action: string // What to do with this info when generating SOP
}

// -----------------------------------------------------------------------------
// AI Response Structure - JSON format from aisop.md
// -----------------------------------------------------------------------------

export interface AIResponseNote {
    category: string
    priority: 'high' | 'medium' | 'low'
    content: string
    relatedTo: string
    action: string
}

export interface AIResponse {
    message: string
    notes: AIResponseNote[]
    phase: ConversationPhase
    progress: number // 0-100
}

// -----------------------------------------------------------------------------
// Chat Message Types
// -----------------------------------------------------------------------------

export interface ChatMessage {
    id: string
    role: 'ai' | 'user'
    content: string
    timestamp: string
}

// -----------------------------------------------------------------------------
// SOP Document Types
// -----------------------------------------------------------------------------

export interface SOP {
    id: string
    title: string
    department?: string
    status: 'draft' | 'complete' | 'archived'
    createdAt: string
    updatedAt: string
    content: string
    notes: Note[]
    chatHistory: ChatMessage[]
}

// -----------------------------------------------------------------------------
// Session State - For active SOP creation sessions
// -----------------------------------------------------------------------------

export interface SessionState {
    id: string
    title: string
    messages: ChatMessage[]
    notes: Note[]
    phase: ConversationPhase
    phaseProgress: number
    questionsAsked: number
    createdAt: string
    metadata?: Record<string, any>
}

// -----------------------------------------------------------------------------
// Category Styling - For UI display
// -----------------------------------------------------------------------------

export interface CategoryStyle {
    bg: string
    text: string
    label: string
    icon?: string
}

export const CATEGORY_STYLES: Record<NoteCategory, CategoryStyle> = {
    HEADER_INFO: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Header Info' },
    PURPOSE_SCOPE: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Purpose & Scope' },
    ROLES_RESPONSIBILITIES: { bg: 'bg-green-100', text: 'text-green-700', label: 'Roles' },
    PROCEDURE_STEPS: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Procedure' },
    DECISION_POINTS: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Decision Points' },
    QUALITY_SUCCESS: { bg: 'bg-teal-100', text: 'text-teal-700', label: 'Quality' },
    TROUBLESHOOTING: { bg: 'bg-red-100', text: 'text-red-700', label: 'Troubleshooting' },
    DEFINITIONS_REFERENCES: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Definitions' },
    MATERIALS_RESOURCES: { bg: 'bg-cyan-100', text: 'text-cyan-700', label: 'Materials' },
    VISUAL_AIDS: { bg: 'bg-pink-100', text: 'text-pink-700', label: 'Visual Aids' },
    GAPS_IMPROVEMENTS: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Gaps' },
    METADATA: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Metadata' },
    OTHER: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Other' },
}

// -----------------------------------------------------------------------------
// Priority Styling
// -----------------------------------------------------------------------------

export const PRIORITY_STYLES = {
    high: { color: 'text-red-500', icon: '!!' },
    medium: { color: 'text-amber-500', icon: '!' },
    low: { color: 'text-green-500', icon: '·' },
} as const

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

/**
 * Validates if a string is a valid NoteCategory
 */
export function isValidNoteCategory(category: string): category is NoteCategory {
    return category in NOTE_CATEGORIES
}

/**
 * Validates if a string is a valid ConversationPhase
 */
export function isValidPhase(phase: string): phase is ConversationPhase {
    return phase in CONVERSATION_PHASES
}

/**
 * Get the next phase in the conversation flow
 */
export function getNextPhase(currentPhase: ConversationPhase): ConversationPhase {
    const phases: ConversationPhase[] = ['foundation', 'process', 'accountability', 'quality', 'finalization', 'complete']
    const currentIndex = phases.indexOf(currentPhase)
    if (currentIndex < phases.length - 1) {
        return phases[currentIndex + 1]
    }
    return 'complete'
}

/**
 * Calculate overall progress based on phase and phase progress
 */
export function calculateOverallProgress(phase: ConversationPhase, phaseProgress: number): number {
    const phaseWeights: Record<ConversationPhase, { start: number; weight: number }> = {
        foundation: { start: 0, weight: 15 },
        process: { start: 15, weight: 35 },
        accountability: { start: 50, weight: 15 },
        quality: { start: 65, weight: 20 },
        finalization: { start: 85, weight: 15 },
        complete: { start: 100, weight: 0 },
    }

    const { start, weight } = phaseWeights[phase]
    return Math.min(100, start + (phaseProgress / 100) * weight)
}

/**
 * Generate a unique ID
 */
export function generateId(prefix: string = 'id'): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
