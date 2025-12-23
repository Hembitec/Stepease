"use client"

import { useState } from "react"
import { Pencil, Trash2, ChevronDown, ChevronUp, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CATEGORY_STYLES, PRIORITY_STYLES, type Note } from "@/lib/types"
import { cn } from "@/lib/utils"

const categoryColors = CATEGORY_STYLES
const priorityColors = PRIORITY_STYLES

interface NoteCardProps {
  note: Note
  onEdit?: (note: Note) => void
  onDelete?: (id: string) => void
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const colors = categoryColors[note.category] || categoryColors.OTHER
  const priorityColor = priorityColors[note.priority]

  const truncatedContent = note.content.length > 120 ? note.content.slice(0, 120) + "..." : note.content

  return (
    <div className="bg-background border border-border rounded-lg p-3 hover:border-primary/30 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full", colors.bg, colors.text)}>
          {colors.label || note.category.replace(/_/g, " ")}
        </span>
        <div className="flex items-center gap-1">
          {note.priority === "high" && <AlertCircle className={cn("w-3 h-3", priorityColor)} />}
          <span className={cn("text-xs font-medium capitalize", priorityColor)}>{note.priority}</span>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-foreground leading-relaxed mb-2">{isExpanded ? note.content : truncatedContent}</p>

      {note.content.length > 120 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary text-xs font-medium flex items-center gap-1 mb-2 hover:underline"
        >
          {isExpanded ? (
            <>
              Show less <ChevronUp className="w-3 h-3" />
            </>
          ) : (
            <>
              Read more <ChevronDown className="w-3 h-3" />
            </>
          )}
        </button>
      )}

      {/* Meta - Related To */}
      {note.relatedTo && (
        <p className="text-xs text-muted-foreground mb-2">
          <span className="font-medium">Maps to:</span> {note.relatedTo}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-1 pt-1 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit?.(note)}
          className="h-7 text-xs text-muted-foreground hover:text-primary flex-1"
        >
          <Pencil className="w-3 h-3 mr-1" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete?.(note.id)}
          className="h-7 text-xs text-muted-foreground hover:text-destructive flex-1"
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  )
}
