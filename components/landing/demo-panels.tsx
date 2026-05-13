"use client"

// =============================================================================
// Demo Showcase - Notes Panel Component
// Shows extracted notes appearing with animations during the demo
// =============================================================================

import { ArrowRight, CheckCircle2, Download, FileText, Search, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DemoNote } from "./demo-data"

interface DemoNotesPanelProps {
    notes: DemoNote[]
    totalNotes: number
    reviewReady?: boolean
}

export function DemoNotesPanel({ notes, totalNotes, reviewReady = false }: DemoNotesPanelProps) {
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
                    <div className="py-3 space-y-2.5">
                        <div className="rounded-lg border border-dashed border-slate-200 bg-white px-3 py-3">
                            <FileText className="w-6 h-6 text-slate-300 mb-2" />
                            <p className="text-[11px] font-medium text-slate-500">
                                Notes appear here as Stepease extracts them from the conversation.
                            </p>
                        </div>
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="rounded-lg border border-slate-200 bg-white p-3"
                            >
                                <div className="h-4 w-20 rounded-md bg-slate-100" />
                                <div className="mt-3 h-2.5 w-full rounded-full bg-slate-100" />
                                <div className="mt-2 h-2.5 w-5/6 rounded-full bg-slate-100" />
                            </div>
                        ))}
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

            <div className="border-t border-slate-200 bg-white p-3">
                <button
                    type="button"
                    className={cn(
                        "flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                        reviewReady
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-400"
                    )}
                >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {reviewReady ? "Review & Generate SOP" : "Capturing Notes"}
                </button>
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
                        Final SOP
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                        v1
                    </span>
                </div>
                <div className="flex gap-1.5">
                    <span className="text-[10px] sm:text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                        Preview
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                        <Download className="h-3 w-3" />
                        Export
                    </span>
                    <span className="text-[10px] sm:text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-medium">
                        Share
                    </span>
                </div>
            </div>

            <div className="border-b border-slate-100 px-3 sm:px-4 py-2">
                <div className="flex gap-1.5">
                    <span className="rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white">
                        Preview
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">
                        Markdown
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
                        const metaMatch = line.match(/^\*\*(.+?):\*\*\s*(.+)$/)
                        if (metaMatch) {
                            return (
                                <div
                                    key={i}
                                    className="grid grid-cols-[auto_1fr] gap-2 border-b border-slate-100 py-1 text-[11px] sm:text-xs"
                                >
                                    <span className="font-semibold text-slate-700">{metaMatch[1]}:</span>
                                    <span className="text-slate-600">{metaMatch[2]}</span>
                                </div>
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
                        if (/^\d+\.\s/.test(line)) {
                            const [, numeral, text] = line.match(/^(\d+)\.\s(.+)$/) || []
                            return (
                                <div
                                    key={i}
                                    className="grid grid-cols-[1.25rem_1fr] gap-2 py-0.5 text-[11px] sm:text-xs text-slate-600"
                                >
                                    <span className="font-semibold text-slate-700">{numeral}.</span>
                                    <span>{text}</span>
                                </div>
                            )
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

const REVIEW_CATEGORY_ORDER = [
    "HEADER_INFO",
    "PURPOSE_SCOPE",
    "ROLES_RESPONSIBILITIES",
    "PROCEDURE_STEPS",
    "DECISION_POINTS",
    "QUALITY_SUCCESS",
    "TROUBLESHOOTING",
    "DEFINITIONS_REFERENCES",
    "MATERIALS_RESOURCES",
    "METADATA",
]

export function DemoReviewBoard({ notes }: { notes: DemoNote[] }) {
    const groupedNotes = REVIEW_CATEGORY_ORDER
        .map((category) => {
            const items = notes.filter((note) => note.category === category)
            return items.length > 0
                ? {
                    category,
                    label: items[0].label,
                    color: items[0].color,
                    items,
                }
                : null
        })
        .filter(Boolean) as Array<{
        category: string
        label: string
        color: string
        items: DemoNote[]
    }>

    const coverage = Math.min(100, Math.round((groupedNotes.length / REVIEW_CATEGORY_ORDER.length) * 100))
    const highlightedGroups = groupedNotes.slice(0, 4)

    return (
        <div className="h-full bg-slate-50 p-3 sm:p-4">
            <div className="grid h-full gap-3 lg:grid-cols-[minmax(0,1fr)_19rem] xl:grid-cols-[minmax(0,1.05fr)_20rem]">
                <div className="flex min-h-0 flex-col rounded-xl border border-slate-200 bg-white">
                    <div className="border-b border-slate-200 px-4 py-3">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    Review Notes
                                </p>
                                <h3 className="mt-1 text-sm font-semibold text-slate-900 sm:text-base">
                                    Procedural Architecture
                                </h3>
                            </div>
                            <div className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700">
                                Coverage {coverage}%
                            </div>
                        </div>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-blue-600 transition-all duration-700"
                                style={{ width: `${coverage}%` }}
                            />
                        </div>
                    </div>

                    <div className="border-b border-slate-100 px-4 py-3">
                        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-400">
                            <Search className="h-3.5 w-3.5" />
                            Search captured details...
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-3">
                        <div className="space-y-2">
                            {groupedNotes.map((group) => (
                                <div
                                    key={group.category}
                                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2"
                                >
                                    <div className="flex min-w-0 items-center gap-2">
                                        <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-medium", group.color)}>
                                            {group.label}
                                        </span>
                                        <span className="truncate text-xs text-slate-500">
                                            {group.items[0].content}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-semibold text-slate-400">
                                        {group.items.length}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex min-h-0 flex-col gap-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                            Ready To Generate
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <h4 className="text-sm font-semibold text-slate-900">
                                {notes.length} structured notes captured
                            </h4>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-slate-500">
                            Stepease has mapped the conversation into SOP sections, ownership, tooling, and quality checks.
                        </p>
                    </div>

                    <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4">
                        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Next step
                            </div>
                            <p className="mt-1 text-xs leading-relaxed text-slate-600">
                                Generate the draft, then open preview mode to edit sections or export the SOP.
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4">
                        <div className="space-y-2.5">
                            {highlightedGroups.map((group) => (
                                <div
                                    key={group.category}
                                    className="rounded-lg border border-slate-200 p-3"
                                >
                                    <div className="mb-1.5 flex items-center gap-2">
                                        <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-medium", group.color)}>
                                            {group.label}
                                        </span>
                                        <span className="text-[10px] font-medium text-slate-400">
                                            {group.items.length} captured
                                        </span>
                                    </div>
                                    <p className="text-xs leading-relaxed text-slate-600">
                                        {group.items[0].content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm"
                    >
                        Generate SOP
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
