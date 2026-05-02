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
  const priorityInfo = priorityColors[note.priority]
  const isHighPriority = note.priority === 'high'

  return (
    <div className={cn(
      "bg-white border rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-0.5",
      isHighPriority 
        ? "border-red-200 bg-red-50/10 ring-1 ring-red-100" 
        : "border-slate-200 hover:border-blue-200"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={cn("px-2.5 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider", colors.bg, colors.text)}>
            {colors.label}
          </div>
          <div className={cn(
            "flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
            isHighPriority ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-500"
          )}>
            <Circle className={cn("w-2 h-2 fill-current")} />
            {note.priority}
          </div>
        </div>
        <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <MessageSquare className="w-3 h-3" />
          Captured via {note.source}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 mb-6">
        <div>
          <p className="text-sm text-slate-800 leading-relaxed font-medium">{note.content}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {note.relatedTo && (
            <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mapping</h4>
              <p className="text-xs text-slate-700 font-semibold">{note.relatedTo}</p>
            </div>
          )}

          {note.action && (
            <div className="bg-blue-50/30 p-3 rounded-xl border border-blue-100/50">
              <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">AI Instruction</h4>
              <p className="text-xs text-blue-700 font-semibold">{note.action}</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-slate-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(note)}
          className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 h-8 px-3 rounded-lg text-xs font-bold uppercase tracking-tight"
        >
          <Pencil className="w-3.5 h-3.5 mr-1.5" />
          Edit Detail
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(note.id)}
          className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-8 px-3 rounded-lg text-xs font-bold uppercase tracking-tight ml-auto"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1.5" />
          Discard
        </Button>
      </div>
    </div>
  )
}
