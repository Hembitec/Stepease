"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Note, NoteCategory } from "@/lib/types"
import { CATEGORY_STYLES } from "@/lib/types"
import { cn } from "@/lib/utils"

const categoryColors = CATEGORY_STYLES

interface NoteEditorModalProps {
  note: Note | null
  isOpen: boolean
  onClose: () => void
  onSave: (note: Note) => void
  isNew?: boolean
}

const categories = [
  "HEADER_INFO",
  "PURPOSE_SCOPE",
  "ROLES_RESPONSIBILITIES",
  "PROCEDURE_STEPS",
  "QUALITY_SUCCESS",
  "TROUBLESHOOTING",
  "OTHER",
]

const priorities = ["high", "medium", "low"] as const

export function NoteEditorModal({ note, isOpen, onClose, onSave, isNew }: NoteEditorModalProps) {
  const [editedNote, setEditedNote] = useState<Note | null>(null)

  useEffect(() => {
    if (note) {
      setEditedNote({ ...note })
    } else if (isNew) {
      setEditedNote({
        id: `note-${Date.now()}`,
        category: "OTHER",
        priority: "medium",
        timestamp: "Manual Entry",
        source: "Manual",
        content: "",
        relatedTo: "",
        action: "",
      })
    }
  }, [note, isNew])

  if (!isOpen || !editedNote) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editedNote.content.trim()) {
      onSave(editedNote)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">{isNew ? "Add New Note" : "Edit Note"}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const colors = categoryColors[cat as NoteCategory] || categoryColors.OTHER
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setEditedNote({ ...editedNote, category: cat as NoteCategory })}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-full transition-all",
                      editedNote.category === cat
                        ? `${colors.bg} ${colors.text} ring-2 ring-offset-1 ring-blue-500`
                        : "bg-slate-50 text-slate-500 hover:bg-slate-100",
                    )}
                  >
                    {cat.replace(/_/g, " ")}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
            <div className="flex gap-2">
              {priorities.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setEditedNote({ ...editedNote, priority: p })}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg capitalize transition-all",
                    editedNote.priority === p
                      ? p === "high"
                        ? "bg-red-100 text-red-700 ring-2 ring-red-500"
                        : p === "medium"
                          ? "bg-yellow-100 text-yellow-700 ring-2 ring-yellow-500"
                          : "bg-green-100 text-green-700 ring-2 ring-green-500"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
            <textarea
              value={editedNote.content}
              onChange={(e) => setEditedNote({ ...editedNote, content: e.target.value })}
              placeholder="Describe the note content..."
              className="w-full h-32 p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder:text-slate-400"
              required
            />
          </div>

          {/* Related To */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Related To</label>
            <input
              type="text"
              value={editedNote.relatedTo}
              onChange={(e) => setEditedNote({ ...editedNote, relatedTo: e.target.value })}
              placeholder="e.g., Step 3 - Approval Process"
              className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
            />
          </div>

          {/* Action */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Action Required</label>
            <input
              type="text"
              value={editedNote.action}
              onChange={(e) => setEditedNote({ ...editedNote, action: e.target.value })}
              placeholder="e.g., Add approval step with 24hr SLA"
              className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              {isNew ? "Add Note" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
