"use client"

import type React from "react"

import { useState } from "react"
import { X, Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SectionEditorModalProps {
  sectionTitle: string
  content: string
  isOpen: boolean
  onClose: () => void
  onSave: (content: string) => void
}

export function SectionEditorModal({ sectionTitle, content, isOpen, onClose, onSave }: SectionEditorModalProps) {
  const [editedContent, setEditedContent] = useState(content)
  const [aiPrompt, setAiPrompt] = useState("")
  const [isAiLoading, setIsAiLoading] = useState(false)

  if (!isOpen) return null

  const handleAiRequest = () => {
    if (!aiPrompt.trim()) return

    setIsAiLoading(true)
    setTimeout(() => {
      // Simulate AI modification
      setEditedContent((prev) => prev + `\n\n*AI suggestion based on: "${aiPrompt}"*`)
      setAiPrompt("")
      setIsAiLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleAiRequest()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Editing: {sectionTitle}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Original Content (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Current Content:</label>
            <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600 max-h-32 overflow-y-auto">
              <pre className="whitespace-pre-wrap font-mono">{content}</pre>
            </div>
          </div>

          {/* Editable Content */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Edit Mode:</label>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-48 p-4 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* AI Assistant */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium text-blue-900">AI Assistant</h4>
            </div>
            <p className="text-sm text-blue-700 mb-3">Ask me to modify this section:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='e.g., "Add quality check after step 3"'
                disabled={isAiLoading}
                className="flex-1 px-4 py-2 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <Button
                onClick={handleAiRequest}
                disabled={!aiPrompt.trim() || isAiLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isAiLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-slate-200 bg-slate-50">
          <Button variant="outline" onClick={() => setEditedContent(content)} className="text-slate-600 bg-transparent">
            Revert to Original
          </Button>
          <div className="flex-1" />
          <Button variant="outline" onClick={onClose} className="bg-transparent">
            Cancel
          </Button>
          <Button onClick={() => onSave(editedContent)} className="bg-blue-600 hover:bg-blue-700 text-white">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
