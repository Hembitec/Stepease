"use client"

// =============================================================================
// STEPWISE - ENHANCED NOTES PANEL
// Displays categorized notes with priority indicators
// =============================================================================

import { useState, useMemo } from "react"
import { FileEdit, Trash2, ChevronDown, ChevronRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  type Note,
  type NoteCategory,
  CATEGORY_STYLES,
  PRIORITY_STYLES,
  NOTE_CATEGORIES,
} from "@/lib/types"
import { PhaseIndicator } from "@/components/chat/phase-indicator"
import type { ConversationPhase } from "@/lib/types"
import type { AnalysisResult } from "@/lib/sop-analyzer"
import type { ImprovementStatus } from "@/lib/improvement-helpers"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface NotesPanelProps {
  notes: Note[]
  onDeleteNote?: (id: string) => void
  onEditNote?: (note: Note) => void
  onReview?: () => void
  progress: number
  phase: ConversationPhase | string
  // Improvement mode props
  isImprovementMode?: boolean
  analysisResult?: AnalysisResult
  improvementStatus?: Record<string, ImprovementStatus>
}

// -----------------------------------------------------------------------------
// Note Card Component
// -----------------------------------------------------------------------------

function NoteCard({
  note,
  onDelete,
  onEdit,
}: {
  note: Note
  onDelete?: () => void
  onEdit?: () => void
}) {
  const categoryStyle = CATEGORY_STYLES[note.category] || CATEGORY_STYLES.METADATA
  const priorityStyle = PRIORITY_STYLES[note.priority]

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3 hover:shadow-sm transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              "px-2 py-0.5 rounded text-xs font-medium",
              categoryStyle.bg,
              categoryStyle.text
            )}
          >
            {categoryStyle.label}
          </span>
          <span className={cn("text-sm font-bold", priorityStyle.color)}>
            {priorityStyle.icon}
          </span>
        </div>
        <span className="text-xs text-slate-400 whitespace-nowrap">
          {note.timestamp}
        </span>
      </div>

      {/* Content */}
      <p className="text-sm text-slate-700 mb-2 line-clamp-3">{note.content}</p>

      {/* Related To */}
      {note.relatedTo && (
        <p className="text-xs text-slate-500 mb-2">
          <span className="font-medium">→</span> {note.relatedTo}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="text-xs text-slate-400">{note.source}</span>
        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
              title="Edit note"
            >
              <FileEdit className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1 text-slate-400 hover:text-red-500 transition-colors"
              title="Delete note"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Category Group Component
// -----------------------------------------------------------------------------

function CategoryGroup({
  category,
  notes,
  onDeleteNote,
  onEditNote,
  defaultExpanded = true,
}: {
  category: NoteCategory
  notes: Note[]
  onDeleteNote?: (id: string) => void
  onEditNote?: (note: Note) => void
  defaultExpanded?: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const categoryStyle = CATEGORY_STYLES[category]

  return (
    <div className="space-y-2">
      {/* Category Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
          <span
            className={cn(
              "px-2 py-0.5 rounded text-xs font-medium",
              categoryStyle.bg,
              categoryStyle.text
            )}
          >
            {categoryStyle.label}
          </span>
        </div>
        <span className="text-xs text-slate-400">{notes.length}</span>
      </button>

      {/* Notes */}
      {isExpanded && (
        <div className="space-y-2 pl-6">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={onDeleteNote ? () => onDeleteNote(note.id) : undefined}
              onEdit={onEditNote ? () => onEditNote(note) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// -----------------------------------------------------------------------------
// Analysis Summary Component (for Improvement Mode)
// -----------------------------------------------------------------------------

function AnalysisSummary({
  analysisResult,
  improvementStatus,
}: {
  analysisResult: AnalysisResult
  improvementStatus: Record<string, ImprovementStatus>
}) {
  const totalImprovements = analysisResult.improvements.length
  const addressedCount = Object.values(improvementStatus).filter(s => s === 'addressed').length
  const progressPercent = totalImprovements > 0
    ? Math.round((addressedCount / totalImprovements) * 100)
    : 0

  const highPriority = analysisResult.improvements.filter(i => i.priority === 'High')
  const mediumPriority = analysisResult.improvements.filter(i => i.priority === 'Medium')
  const lowPriority = analysisResult.improvements.filter(i => i.priority === 'Low')

  const getStatusIcon = (idx: number) => {
    const status = improvementStatus[`improvement-${idx}`]
    return status === 'addressed' ? '✅' : '⏳'
  }

  const getImprovementIndex = (improvement: AnalysisResult['improvements'][0]) => {
    return analysisResult.improvements.indexOf(improvement)
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg p-4 border border-slate-200">
      <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
        📊 Analysis Summary
      </h4>

      {/* Score and Progress */}
      <div className="flex gap-3 text-sm mb-3">
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">
          Quality: {analysisResult.quality.overall}/100
        </span>
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded font-medium">
          Progress: {addressedCount}/{totalImprovements}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Priority Sections */}
      <div className="space-y-3">
        {highPriority.length > 0 && (
          <div>
            <span className="text-xs font-semibold text-red-600 flex items-center gap-1">
              🔴 HIGH PRIORITY ({highPriority.length})
            </span>
            <ul className="mt-1 space-y-1">
              {highPriority.map((imp) => (
                <li key={getImprovementIndex(imp)} className="text-xs text-slate-600 flex items-center gap-2">
                  <span>{getStatusIcon(getImprovementIndex(imp))}</span>
                  <span className="truncate">{imp.description.slice(0, 45)}...</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {mediumPriority.length > 0 && (
          <div>
            <span className="text-xs font-semibold text-yellow-600 flex items-center gap-1">
              🟡 MEDIUM PRIORITY ({mediumPriority.length})
            </span>
            <ul className="mt-1 space-y-1">
              {mediumPriority.map((imp) => (
                <li key={getImprovementIndex(imp)} className="text-xs text-slate-600 flex items-center gap-2">
                  <span>{getStatusIcon(getImprovementIndex(imp))}</span>
                  <span className="truncate">{imp.description.slice(0, 45)}...</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {lowPriority.length > 0 && (
          <div>
            <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
              🔵 LOW PRIORITY ({lowPriority.length})
            </span>
            <ul className="mt-1 space-y-1">
              {lowPriority.map((imp) => (
                <li key={getImprovementIndex(imp)} className="text-xs text-slate-600 flex items-center gap-2">
                  <span>{getStatusIcon(getImprovementIndex(imp))}</span>
                  <span className="truncate">{imp.description.slice(0, 45)}...</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Main Notes Panel
// -----------------------------------------------------------------------------

export function NotesPanel({
  notes,
  onDeleteNote,
  onEditNote,
  onReview,
  progress,
  phase,
  isImprovementMode = false,
  analysisResult,
  improvementStatus = {},
}: NotesPanelProps) {
  const [viewMode, setViewMode] = useState<"grouped" | "list">("grouped")

  // Group notes by category
  const groupedNotes = useMemo(() => {
    const groups: Partial<Record<NoteCategory, Note[]>> = {}

    for (const note of notes) {
      if (!groups[note.category]) {
        groups[note.category] = []
      }
      groups[note.category]!.push(note)
    }

    return groups
  }, [notes])

  // Order categories by priority (procedure steps first, etc.)
  const categoryOrder: NoteCategory[] = [
    "HEADER_INFO",
    "PURPOSE_SCOPE",
    "ROLES_RESPONSIBILITIES",
    "PROCEDURE_STEPS",
    "DECISION_POINTS",
    "QUALITY_SUCCESS",
    "TROUBLESHOOTING",
    "MATERIALS_RESOURCES",
    "DEFINITIONS_REFERENCES",
    "VISUAL_AIDS",
    "GAPS_IMPROVEMENTS",
    "METADATA",
  ]

  const sortedCategories = categoryOrder.filter(
    (cat) => groupedNotes[cat] && groupedNotes[cat]!.length > 0
  )

  // Convert phase string to ConversationPhase type
  const normalizedPhase = (phase as ConversationPhase) || "foundation"

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900">Extracted Notes</h3>
          <span className="text-sm text-slate-500">{notes.length} notes</span>
        </div>

        {/* Phase Progress */}
        <PhaseIndicator
          currentPhase={normalizedPhase}
          progress={progress}
          variant="compact"
        />
      </div>

      {/* Notes Content - Everything in ScrollArea for proper overflow handling */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-4">
          {/* Analysis Summary - Inside scroll area */}
          {isImprovementMode && analysisResult && (
            <AnalysisSummary
              analysisResult={analysisResult}
              improvementStatus={improvementStatus}
            />
          )}

          {/* Notes */}
          {notes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileEdit className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-sm text-slate-500 mb-1">No notes yet</p>
              <p className="text-xs text-slate-400">
                Notes will appear here as you chat with the AI
              </p>
            </div>
          ) : viewMode === "grouped" ? (
            <div className="space-y-4">
              {sortedCategories.map((category) => (
                <CategoryGroup
                  key={category}
                  category={category}
                  notes={groupedNotes[category]!}
                  onDeleteNote={onDeleteNote}
                  onEditNote={onEditNote}
                  defaultExpanded={true}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDelete={onDeleteNote ? () => onDeleteNote(note.id) : undefined}
                  onEdit={onEditNote ? () => onEditNote(note) : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setViewMode("grouped")}
            className={cn(
              "flex-1 py-1.5 text-xs font-medium rounded transition-colors",
              viewMode === "grouped"
                ? "bg-blue-100 text-blue-700"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            By Category
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "flex-1 py-1.5 text-xs font-medium rounded transition-colors",
              viewMode === "list"
                ? "bg-blue-100 text-blue-700"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            All Notes
          </button>
        </div>

        <Button
          onClick={onReview}
          disabled={notes.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Review & Generate SOP
        </Button>
      </div>
    </div>
  )
}
