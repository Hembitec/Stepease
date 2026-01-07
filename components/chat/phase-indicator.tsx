"use client"

// =============================================================================
// Stepease - PHASE INDICATOR
// Visual progress indicator for the 5-phase conversation flow
// =============================================================================

import { CheckCircle2, Circle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { CONVERSATION_PHASES, type ConversationPhase } from "@/lib/types"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface PhaseIndicatorProps {
    currentPhase: ConversationPhase
    progress: number // 0-100 overall progress
    className?: string
    variant?: "compact" | "detailed"
}

// -----------------------------------------------------------------------------
// Phase Configuration
// -----------------------------------------------------------------------------

const PHASE_ORDER: ConversationPhase[] = [
    "foundation",
    "process",
    "accountability",
    "quality",
    "finalization",
]

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PhaseIndicator({
    currentPhase,
    progress,
    className,
    variant = "compact",
}: PhaseIndicatorProps) {
    const currentIndex = PHASE_ORDER.indexOf(currentPhase)

    if (variant === "compact") {
        return (
            <div className={cn("flex items-center gap-2", className)}>
                {/* Phase Pills */}
                <div className="flex items-center gap-1">
                    {PHASE_ORDER.map((phase, index) => {
                        const isComplete = index < currentIndex
                        const isCurrent = index === currentIndex
                        const isPending = index > currentIndex

                        return (
                            <div
                                key={phase}
                                className={cn(
                                    "h-2 rounded-full transition-all duration-300",
                                    index === 0 ? "w-8" : "w-6",
                                    isComplete && "bg-emerald-500",
                                    isCurrent && "bg-blue-600",
                                    isPending && "bg-slate-200"
                                )}
                                title={CONVERSATION_PHASES[phase].name}
                            />
                        )
                    })}
                </div>

                {/* Current Phase Label */}
                <span className="text-xs font-medium text-slate-600">
                    {CONVERSATION_PHASES[currentPhase].name}
                </span>

                {/* Progress Percentage */}
                <span className="text-xs text-slate-400">
                    {Math.round(progress)}%
                </span>
            </div>
        )
    }

    // Detailed variant
    return (
        <div className={cn("space-y-4", className)}>
            {/* Overall Progress Bar */}
            <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-900">
                        {CONVERSATION_PHASES[currentPhase].name}
                    </span>
                    <span className="text-slate-500">{Math.round(progress)}% complete</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Phase Steps */}
            <div className="space-y-2">
                {PHASE_ORDER.map((phase, index) => {
                    const phaseInfo = CONVERSATION_PHASES[phase]
                    const isComplete = index < currentIndex
                    const isCurrent = index === currentIndex
                    const isPending = index > currentIndex

                    return (
                        <div
                            key={phase}
                            className={cn(
                                "flex items-center gap-3 p-2 rounded-lg transition-colors",
                                isCurrent && "bg-blue-50",
                                isComplete && "bg-emerald-50/50"
                            )}
                        >
                            {/* Icon */}
                            <div
                                className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                                    isComplete && "bg-emerald-500 text-white",
                                    isCurrent && "bg-blue-600 text-white",
                                    isPending && "bg-slate-200 text-slate-400"
                                )}
                            >
                                {isComplete ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                ) : isCurrent ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Circle className="w-3 h-3" />
                                )}
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                                <div
                                    className={cn(
                                        "text-sm font-medium truncate",
                                        isComplete && "text-emerald-700",
                                        isCurrent && "text-blue-700",
                                        isPending && "text-slate-400"
                                    )}
                                >
                                    {phaseInfo.name}
                                </div>
                                <div
                                    className={cn(
                                        "text-xs truncate",
                                        isComplete && "text-emerald-600/70",
                                        isCurrent && "text-blue-600/70",
                                        isPending && "text-slate-400"
                                    )}
                                >
                                    {phaseInfo.description}
                                </div>
                            </div>

                            {/* Status */}
                            {isComplete && (
                                <span className="text-xs font-medium text-emerald-600">Done</span>
                            )}
                            {isCurrent && (
                                <span className="text-xs font-medium text-blue-600">In Progress</span>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// -----------------------------------------------------------------------------
// Mini Phase Badge (for header)
// -----------------------------------------------------------------------------

interface PhaseBadgeProps {
    phase: ConversationPhase
    progress: number
    className?: string
}

export function PhaseBadge({ phase, progress, className }: PhaseBadgeProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
                "bg-blue-50 border border-blue-200",
                className
            )}
        >
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-medium text-blue-700">
                {CONVERSATION_PHASES[phase].name}
            </span>
            <span className="text-xs text-blue-500">{Math.round(progress)}%</span>
        </div>
    )
}
