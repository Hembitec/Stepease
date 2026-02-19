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
// Phase Progress Bar
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
        <div className="flex items-center gap-1 sm:gap-2 overflow-hidden">
            {phases.map((phase, index) => {
                const isComplete = index < currentPhaseIndex
                const isCurrent = index === currentPhaseIndex

                return (
                    <div key={phase.id} className="flex items-center gap-1 sm:gap-1.5">
                        <div
                            className={cn(
                                "h-1.5 sm:h-2 rounded-full transition-all duration-500",
                                index === 0 ? "w-6 sm:w-8" : "w-4 sm:w-6",
                                isComplete && "bg-emerald-500",
                                isCurrent && "bg-blue-600",
                                !isComplete && !isCurrent && "bg-slate-200"
                            )}
                        />
                    </div>
                )
            })}
            <span className="text-[10px] sm:text-xs font-medium text-slate-500 ml-1 hidden sm:inline truncate">
                {phases[currentPhaseIndex]?.name || "Complete"}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-400 flex-shrink-0">
                {Math.round(progress)}%
            </span>
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
