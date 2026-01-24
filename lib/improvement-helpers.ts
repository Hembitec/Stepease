// =============================================================================
// Stepease - IMPROVEMENT MODE HELPERS
// Utilities for context-aware SOP improvement conversations
// =============================================================================

import type { AnalysisResult } from "./sop-analyzer"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type ImprovementStatus = 'pending' | 'in-progress' | 'addressed'

export interface ImprovementProgress {
    total: number
    addressed: number
    pending: number
    percentComplete: number
}

// -----------------------------------------------------------------------------
// Greeting Generation
// -----------------------------------------------------------------------------

/**
 * Generates a clean, conversational greeting for improvement mode
 * No scores, no emojis, no verbose analysis - just a friendly start
 */
export function generateImprovementGreeting(analysis: AnalysisResult): string {
    const { high, medium, low } = categorizeImprovementsByPriority(analysis)
    const firstIssue = high[0] || medium[0] || low[0]

    if (!firstIssue) {
        return "I've reviewed your SOP. It looks quite complete! Is there anything specific you'd like to improve or add?"
    }

    // Generate a simple, conversational question about the first issue
    const question = getConversationalQuestion(firstIssue)

    return `I've reviewed your SOP. Let's work through a few improvements together.\n\n${question}`
}

/**
 * Converts an improvement issue into a natural conversational question
 */
function getConversationalQuestion(issue: AnalysisResult['improvements'][0]): string {
    const desc = issue.description.toLowerCase()

    if (desc.includes("role") || desc.includes("responsibilit")) {
        return "First, who is the primary person or role responsible for this process?"
    }

    if (desc.includes("revision") || desc.includes("version") || desc.includes("history")) {
        return "First, what version number should this SOP be, and when was it last updated?"
    }

    if (desc.includes("troubleshoot") || desc.includes("error") || desc.includes("issue") || desc.includes("failure")) {
        return "First, what are the most common problems people run into with this process, and what should they do if something goes wrong?"
    }

    if (desc.includes("reference") || desc.includes("document") || desc.includes("related")) {
        return "First, are there any related documents, policies, or standards that this SOP references?"
    }

    if (desc.includes("material") || desc.includes("tool") || desc.includes("equipment") || desc.includes("software")) {
        return "First, what tools, equipment, or software are needed for this process?"
    }

    if (desc.includes("quality") || desc.includes("success") || desc.includes("criteria")) {
        return "First, how do you know when this process has been completed successfully? What does a good outcome look like?"
    }

    // Default: ask about the issue directly but conversationally
    return `First, let me ask about this: ${issue.description.toLowerCase()}. Can you provide more details?`
}

// -----------------------------------------------------------------------------
// Progress Tracking
// -----------------------------------------------------------------------------

/**
 * Calculates improvement progress based on status map
 */
export function calculateImprovementProgress(
    totalImprovements: number,
    statusMap: Record<string, ImprovementStatus>
): ImprovementProgress {
    const addressed = Object.values(statusMap).filter(s => s === 'addressed').length
    const pending = totalImprovements - addressed

    return {
        total: totalImprovements,
        addressed,
        pending,
        percentComplete: totalImprovements > 0
            ? Math.round((addressed / totalImprovements) * 100)
            : 0
    }
}

/**
 * Initializes improvement status tracking from analysis
 */
export function initializeImprovementStatus(
    analysis: AnalysisResult
): Record<string, ImprovementStatus> {
    const status: Record<string, ImprovementStatus> = {}

    analysis.improvements.forEach((_, idx) => {
        status[`improvement-${idx}`] = 'pending'
    })

    return status
}

/**
 * Categorizes improvements by priority level
 */
export function categorizeImprovementsByPriority(analysis: AnalysisResult) {
    return {
        high: analysis.improvements.filter(i => i.priority === "High"),
        medium: analysis.improvements.filter(i => i.priority === "Medium"),
        low: analysis.improvements.filter(i => i.priority === "Low")
    }
}

// -----------------------------------------------------------------------------
// Score Estimation
// -----------------------------------------------------------------------------

/**
 * Estimates improved score based on addressed issues
 */
export function calculateEstimatedScore(
    originalScore: number,
    analysis: AnalysisResult,
    statusMap: Record<string, ImprovementStatus>
): number {
    let bonus = 0

    analysis.improvements.forEach((imp, idx) => {
        if (statusMap[`improvement-${idx}`] === 'addressed') {
            switch (imp.priority) {
                case 'High': bonus += 6; break
                case 'Medium': bonus += 4; break
                case 'Low': bonus += 2; break
            }
        }
    })

    return Math.min(100, originalScore + bonus)
}

// -----------------------------------------------------------------------------
// Completion Detection
// -----------------------------------------------------------------------------

/**
 * Checks if all improvements have been addressed
 */
export function areAllImprovementsAddressed(
    statusMap: Record<string, ImprovementStatus>
): boolean {
    const statuses = Object.values(statusMap)
    return statuses.length > 0 && statuses.every(s => s === 'addressed')
}

/**
 * Generates clean completion message when all improvements are done
 */
export function generateCompletionMessage(
    originalScore: number,
    estimatedScore: number,
    totalImprovements: number
): string {
    return `Great, we've covered all ${totalImprovements} improvements! Your SOP is now more complete.

You can review the changes in the notes panel, make additional edits, or generate the improved SOP when you're ready.`
}
