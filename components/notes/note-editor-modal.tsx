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

const categories: NoteCategory[] = [
  "HEADER_INFO",
  "PURPOSE_SCOPE",
  "ROLES_RESPONSIBILITIES",
  "PROCEDURE_STEPS",
  "DECISION_POINTS",
  "QUALITY_SUCCESS",
  "TROUBLESHOOTING",
  "DEFINITIONS_REFERENCES",
  "MATERIALS_RESOURCES",
  "GAPS_IMPROVEMENTS",
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{isNew ? "Capture Detail" : "Refine Detail"}</h2>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Procedural Architecture Node</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-10 w-10 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5 text-slate-400" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Architecture Section</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const colors = categoryColors[cat as NoteCategory] || categoryColors.OTHER
                const isSelected = editedNote.category === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setEditedNote({ ...editedNote, category: cat as NoteCategory })}
                    className={cn(
                      "px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 border",
                      isSelected
                        ? `${colors.bg} ${colors.text} border-transparent shadow-sm scale-105 ring-2 ring-blue-500/20`
                        : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50",
                    )}
                  >
                    {colors.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Priority */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Impact Priority</label>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {priorities.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setEditedNote({ ...editedNote, priority: p })}
                    className={cn(
                      "flex-1 py-2 text-xs font-bold rounded-lg capitalize transition-all",
                      editedNote.priority === p
                        ? p === "high"
                          ? "bg-white text-red-600 shadow-sm"
                          : p === "medium"
                            ? "bg-white text-amber-600 shadow-sm"
                            : "bg-white text-emerald-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Related To */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Document Link</label>
              <input
                type="text"
                value={editedNote.relatedTo}
                onChange={(e) => setEditedNote({ ...editedNote, relatedTo: e.target.value })}
                placeholder="e.g., Step 3 - Approval"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Captured Content</label>
            <textarea
              value={editedNote.content}
              onChange={(e) => setEditedNote({ ...editedNote, content: e.target.value })}
              placeholder="Provide the specific detail or instruction..."
              className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none placeholder:text-slate-400 leading-relaxed font-medium"
              required
            />
          </div>

          {/* Action */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">AI Implementation Instruction</label>
            <input
              type="text"
              value={editedNote.action}
              onChange={(e) => setEditedNote({ ...editedNote, action: e.target.value })}
              placeholder="e.g., Format as a warning box"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 font-medium"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-12 rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-50 bg-transparent font-bold">
              Discard
            </Button>
            <Button type="submit" className="flex-1 h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95">
              {isNew ? "Integrate Detail" : "Apply Refinement"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
