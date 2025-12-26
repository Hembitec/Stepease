
import { generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { z } from "zod"
import { SOP_ANALYSIS_PROMPT } from "@/lib/sop-system-prompt"

export interface AnalysisResult {
    structure: {
        hasHeader: boolean
        hasPurpose: boolean
        hasScope: boolean
        hasRoles: boolean
        hasDefinitions: boolean
        hasReferences: boolean
        hasMaterials: boolean
        hasProcedures: boolean
        hasQuality: boolean
        hasTroubleshooting: boolean
        hasAppendices: boolean
        hasRevision: boolean
        completenessScore: number
    }
    quality: {
        clarity: number
        actionability: number
        completeness: number
        overall: number
    }
    strengths: string[]
    improvements: Array<{
        category: "Structure" | "Clarity" | "Content" | "Safety"
        priority: "High" | "Medium" | "Low"
        description: string
        suggestion: string
    }>
    summary: string
}

const analysisResultSchema = z.object({
    structure: z.object({
        hasHeader: z.boolean(),
        hasPurpose: z.boolean(),
        hasScope: z.boolean(),
        hasRoles: z.boolean(),
        hasDefinitions: z.boolean(),
        hasReferences: z.boolean(),
        hasMaterials: z.boolean(),
        hasProcedures: z.boolean(),
        hasQuality: z.boolean(),
        hasTroubleshooting: z.boolean(),
        hasAppendices: z.boolean(),
        hasRevision: z.boolean(),
        completenessScore: z.number(),
    }),
    quality: z.object({
        clarity: z.number(),
        actionability: z.number(),
        completeness: z.number(),
        overall: z.number(),
    }),
    strengths: z.array(z.string()),
    improvements: z.array(z.object({
        category: z.enum(["Structure", "Clarity", "Content", "Safety"]),
        priority: z.enum(["High", "Medium", "Low"]),
        description: z.string(),
        suggestion: z.string(),
    })),
    summary: z.string(),
});

export async function analyzeSOPText(text: string): Promise<AnalysisResult> {
    try {
        const { object } = await generateObject({
            model: google("gemini-3-flash-preview"),
            schema: analysisResultSchema,
            system: SOP_ANALYSIS_PROMPT,
            prompt: `Please analyze the following SOP text:\n\n${text}`,
            temperature: 0.2, // Low temperature for consistent analysis
        })

        return object as AnalysisResult
    } catch (error) {
        console.error("SOP Analysis Error:", error)
        throw new Error("Failed to analyze SOP content")
    }
}
