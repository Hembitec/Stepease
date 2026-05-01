"use client"

// =============================================================================
// Demo Showcase - Notes Panel Component
// Shows extracted notes appearing with animations during the demo
// =============================================================================

import { FileText, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DemoNote } from "./demo-data"

interface DemoNotesPanelProps {
    notes: DemoNote[]
    totalNotes: number
}

export function DemoNotesPanel({ notes, totalNotes }: DemoNotesPanelProps) {
    return (
        <div className="h-full flex flex-col bg-slate-50 border-l border-slate-200">
            {/* Header */}
            <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-200 bg-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-600" />
                        <span className="text-xs sm:text-sm font-semibold text-slate-800">
                            Extracted Notes
                        </span>
                    </div>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        {totalNotes}
                    </span>
                </div>
            </div>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 space-y-2">
                {notes.length === 0 && (
                    <div className="text-center py-8">
                        <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs text-slate-400">
                            Notes appear here as you chat...
                        </p>
                    </div>
                )}

                {notes.map((note, index) => (
                    <div
                        key={`${note.category}-${index}`}
                        className="bg-white rounded-lg border border-slate-200 p-2.5 sm:p-3 animate-in fade-in slide-in-from-right-4 duration-500"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <span
                                className={cn(
                                    "text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded-md",
                                    note.color
                                )}
                            >
                                {note.label}
                            </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                            {note.content}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

// -----------------------------------------------------------------------------
// Phase Progress Bar - Enhanced with labeled segments
// -----------------------------------------------------------------------------

interface DemoPhaseBarProps {
    phases: { id: string; name: string }[]
    currentPhaseIndex: number
    progress: number
}

export function DemoPhaseBar({
    phases,
    currentPhaseIndex,
    progress,
}: DemoPhaseBarProps) {
    return (
        <div className="flex items-center gap-2 sm:gap-3">
            {/* Connected phases with labeled segments */}
            <div className="flex items-center">
                {phases.map((phase, index) => {
                    const isComplete = index < currentPhaseIndex
                    const isCurrent = index === currentPhaseIndex
                    const isLast = index === phases.length - 1

                    return (
                        <div key={phase.id} className="flex items-center">
                            {/* Phase node with number/icon */}
                            <div className="flex flex-col items-center gap-1">
                                <div
                                    className={cn(
                                        "w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-semibold transition-all duration-500 border-2",
                                        isComplete && "bg-emerald-500 border-emerald-500 text-white",
                                        isCurrent && "bg-slate-900 border-slate-900 text-white scale-110 shadow-md",
                                        !isComplete && !isCurrent && "bg-white border-slate-300 text-slate-400"
                                    )}
                                >
                                    {isComplete ? (
                                        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                {/* Phase name label */}
                                <span
                                    className={cn(
                                        "text-[10px] sm:text-xs whitespace-nowrap transition-all duration-300",
                                        isCurrent
                                            ? "text-slate-900 font-semibold"
                                            : isComplete
                                                ? "text-emerald-600 font-medium"
                                                : "text-slate-400"
                                    )}
                                >
                                    {phase.name}
                                </span>
                            </div>
                            {/* Connecting line between phases */}
                            {!isLast && (
                                <div className="flex flex-col items-center mx-1 sm:mx-2">
                                    <div
                                        className={cn(
                                            "w-4 sm:w-6 h-0.5 transition-all duration-500",
                                            isComplete ? "bg-emerald-500" : "bg-slate-200"
                                        )}
                                    />
                                    <div className="h-4" /> {/* Spacer to align with labels */}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
            {/* Progress percentage */}
            <div className="flex flex-col items-center ml-1">
                <span className="text-[10px] sm:text-xs font-semibold text-slate-600">
                    {Math.round(progress)}%
                </span>
                <span className="text-[9px] text-slate-400">done</span>
            </div>
        </div>
    )
}

// -----------------------------------------------------------------------------
// Generated SOP Preview
// -----------------------------------------------------------------------------

interface DemoResultProps {
    content: string
}

export function DemoResult({ content }: DemoResultProps) {
    // Simple markdown-like rendering for the demo preview
    const lines = content.split("\n")

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">
                        Generated SOP
                    </span>
                </div>
                <div className="flex gap-1.5">
                    <span className="text-[10px] sm:text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                        PDF
                    </span>
                    <span className="text-[10px] sm:text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-medium">
                        Word
                    </span>
                    <span className="text-[10px] sm:text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                        MD
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-5">
                <div className="prose prose-sm max-w-none">
                    {lines.map((line, i) => {
                        if (line.startsWith("# ")) {
                            return (
                                <h1
                                    key={i}
                                    className="text-base sm:text-lg font-bold text-slate-900 mb-3 mt-0"
                                >
                                    {line.replace("# ", "")}
                                </h1>
                            )
                        }
                        if (line.startsWith("## ")) {
                            return (
                                <h2
                                    key={i}
                                    className="text-sm sm:text-base font-semibold text-slate-800 mt-4 mb-2 pb-1 border-b border-slate-100"
                                >
                                    {line.replace("## ", "")}
                                </h2>
                            )
                        }
                        if (line.startsWith("### ")) {
                            return (
                                <h3
                                    key={i}
                                    className="text-xs sm:text-sm font-semibold text-slate-700 mt-3 mb-1"
                                >
                                    {line.replace("### ", "")}
                                </h3>
                            )
                        }
                        if (line.startsWith("- [ ] ")) {
                            return (
                                <div
                                    key={i}
                                    className="flex items-start gap-2 py-0.5 text-[11px] sm:text-xs text-slate-600"
                                >
                                    <div className="w-3.5 h-3.5 border border-slate-300 rounded-sm mt-0.5 flex-shrink-0" />
                                    <span>{line.replace("- [ ] ", "")}</span>
                                </div>
                            )
                        }
                        if (line.startsWith("- **")) {
                            const match = line.match(/- \*\*(.+?)\*\* → (.+)/)
                            if (match) {
                                return (
                                    <div
                                        key={i}
                                        className="flex items-start gap-2 py-0.5 text-[11px] sm:text-xs text-slate-600"
                                    >
                                        <span className="text-slate-400">•</span>
                                        <span>
                                            <strong className="text-slate-800">{match[1]}</strong>
                                            {" → "}
                                            {match[2]}
                                        </span>
                                    </div>
                                )
                            }
                        }
                        if (line.startsWith("|") && line.includes("|")) {
                            if (line.includes("---")) return null
                            const cells = line
                                .split("|")
                                .filter(Boolean)
                                .map((c) => c.trim())
                            const isHeader = i > 0 && lines[i + 1]?.includes("---")
                            return (
                                <div
                                    key={i}
                                    className={cn(
                                        "grid grid-cols-2 gap-2 py-1 text-[11px] sm:text-xs border-b border-slate-100",
                                        isHeader && "font-semibold text-slate-800"
                                    )}
                                >
                                    {cells.map((cell, ci) => (
                                        <span
                                            key={ci}
                                            className={cn(
                                                ci === 0 ? "text-slate-700" : "text-slate-600"
                                            )}
                                        >
                                            {cell}
                                        </span>
                                    ))}
                                </div>
                            )
                        }
                        if (line.trim() === "") return <div key={i} className="h-2" />
                        return (
                            <p
                                key={i}
                                className="text-[11px] sm:text-xs text-slate-600 leading-relaxed mb-1"
                            >
                                {line}
                            </p>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
