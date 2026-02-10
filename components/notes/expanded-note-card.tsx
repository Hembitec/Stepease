"use client"

import { Pencil, Trash2, MessageSquare, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CATEGORY_STYLES, PRIORITY_STYLES, type Note } from "@/lib/types"
import { cn } from "@/lib/utils"

const categoryColors = CATEGORY_STYLES
const priorityColors = PRIORITY_STYLES

interface ExpandedNoteCardProps {
  note: Note
  onEdit: (note: Note) => void
  onDelete: (id: string) => void
}

export function ExpandedNoteCard({ note, onEdit, onDelete }: ExpandedNoteCardProps) {
  const colors = categoryColors[note.category] || categoryColors.OTHER
  const priorityColor = priorityColors[note.priority]

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span className={cn("px-3 py-1 text-xs font-semibold rounded-full", colors.bg, colors.text)}>
            {note.category.replace(/_/g, " ")}
          </span>
          <div className="flex items-center gap-1">
            <Circle className={cn("w-3 h-3 fill-current", priorityColor)} />
            <span className="text-xs text-slate-500 capitalize">{note.priority}</span>
          </div>
        </div>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <MessageSquare className="w-3 h-3" />
          {note.timestamp}
        </span>
      </div>

      {/* Content */}
      <div className="space-y-3 mb-4">
        <div>
          <h4 className="text-xs font-medium text-slate-500 mb-1">Content:</h4>
          <p className="text-sm text-slate-800 leading-relaxed">{note.content}</p>
        </div>

        {note.relatedTo && (
          <div>
            <h4 className="text-xs font-medium text-slate-500 mb-1">Related To:</h4>
            <p className="text-sm text-slate-700">{note.relatedTo}</p>
          </div>
        )}

        {note.action && (
          <div>
            <h4 className="text-xs font-medium text-slate-500 mb-1">Action:</h4>
            <p className="text-sm text-slate-700">{note.action}</p>
          </div>
        )}

        <div>
          <h4 className="text-xs font-medium text-slate-500 mb-1">Source:</h4>
          <p className="text-sm text-slate-700">{note.source}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-slate-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(note)}
          className="text-slate-500 hover:text-blue-600 gap-1"
        >
          <Pencil className="w-4 h-4" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(note.id)}
          className="text-slate-500 hover:text-red-600 gap-1"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
      </div>
    </div>
  )
}
