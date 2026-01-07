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
 * Generates a context-aware greeting for improvement mode
 * References the analysis results and starts with the highest priority issue
 */
export function generateImprovementGreeting(analysis: AnalysisResult): string {
    const { high, medium, low } = categorizeImprovementsByPriority(analysis)
    const firstIssue = high[0] || medium[0] || low[0]

    let greeting = buildGreetingHeader(analysis, high.length, medium.length, low.length)

    if (firstIssue) {
        greeting += buildFirstIssueSection(firstIssue)
    }

    return greeting
}

function buildGreetingHeader(
    analysis: AnalysisResult,
    highCount: number,
    mediumCount: number,
    lowCount: number
): string {
    let header = `I've analyzed your SOP and identified **${analysis.improvements.length} areas for improvement**.

📊 **Current Quality Score:** ${analysis.quality.overall}/100
📋 **Completeness:** ${analysis.structure.completenessScore}%
`

    if (highCount > 0) {
        header += `\n🔴 **HIGH Priority:** ${highCount} issue${highCount > 1 ? 's' : ''}`
    }
    if (mediumCount > 0) {
        header += `\n🟡 **MEDIUM Priority:** ${mediumCount} issue${mediumCount > 1 ? 's' : ''}`
    }
    if (lowCount > 0) {
        header += `\n🔵 **LOW Priority:** ${lowCount} issue${lowCount > 1 ? 's' : ''}`
    }

    header += `\n\nLet's address these one by one, starting with the highest priority.`

    return header
}

function buildFirstIssueSection(issue: AnalysisResult['improvements'][0]): string {
    let section = `

---

📋 **Addressing: ${issue.description}** (${issue.priority.toUpperCase()})

${issue.suggestion}

Let me ask you some questions to help fill this gap:`

    // Add specific questions based on issue type
    section += getQuestionsForIssue(issue)

    return section
}

function getQuestionsForIssue(issue: AnalysisResult['improvements'][0]): string {
    const desc = issue.description.toLowerCase()

    if (desc.includes("role") || desc.includes("responsibilit")) {
        return `

1. Who is the primary person/role responsible for this process?
2. Who reviews or approves the work?
3. Who should be contacted if there's an issue?`
    }

    if (desc.includes("revision") || desc.includes("version") || desc.includes("history")) {
        return `

1. What version number should this SOP be?
2. When was the last significant update made?
3. Who typically makes updates to this document?`
    }

    if (desc.includes("troubleshoot") || desc.includes("error") || desc.includes("issue")) {
        return `

1. What are the most common problems users face with this process?
2. What should someone do if they encounter an error?
3. Who should they contact for help?`
    }

    if (desc.includes("reference") || desc.includes("document") || desc.includes("related")) {
        return `

1. Are there any related documents or policies this SOP references?
2. Are there external standards or regulations this follows?`
    }

    return `

Can you provide more details about: ${issue.description.toLowerCase()}?`
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
 * Generates completion message when all improvements are done
 */
export function generateCompletionMessage(
    originalScore: number,
    estimatedScore: number,
    totalImprovements: number
): string {
    return `🎉 **Excellent! We've addressed all ${totalImprovements} improvements!**

📊 **Quality Score:** ${originalScore}/100 → **${estimatedScore}/100**

Your SOP is now significantly more complete and professional.

Would you like to:
1. **Review all the changes** before generating
2. **Make additional edits** to any section
3. **Generate the improved SOP** now`
}
