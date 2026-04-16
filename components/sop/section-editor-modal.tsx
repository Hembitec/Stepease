"use client"

import type React from "react"

import { useState } from "react"
import { X, Send, Sparkles, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface SectionEditorModalProps {
  sectionTitle: string
  content: string
  fullSopContent: string
  sopTitle?: string
  isOpen: boolean
  onClose: () => void
  onSave: (content: string) => void
}

export function SectionEditorModal({ sectionTitle, content, fullSopContent, sopTitle, isOpen, onClose, onSave }: SectionEditorModalProps) {
  const [editedContent, setEditedContent] = useState(content)
  const [aiPrompt, setAiPrompt] = useState("")
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [previousContent, setPreviousContent] = useState<string | null>(null)

  if (!isOpen) return null

  const handleAiRequest = async () => {
    if (!aiPrompt.trim()) return

    setIsAiLoading(true)
    setPreviousContent(editedContent)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // 60s timeout

    try {
      const response = await fetch('/api/chat/edit-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionTitle,
          sectionContent: editedContent,
          fullSopContent,
          sopTitle,
          userPrompt: aiPrompt,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Check for JSON error response
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to edit section')
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Stream the response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let modifiedContent = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          modifiedContent += decoder.decode(value, { stream: true })
          setEditedContent(modifiedContent)
        }
        const finalChunk = decoder.decode()
        if (finalChunk) {
          modifiedContent += finalChunk
          setEditedContent(modifiedContent)
        }
      }

      setAiPrompt("")
      toast.success("Section edited successfully")
    } catch (error) {
      clearTimeout(timeoutId)
      console.error('Failed to edit section:', error)

      let message = 'Failed to edit section with AI.'
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          message = 'Request timed out. Please try again.'
        } else if (error.message.includes('rate limit') || error.message.includes('429')) {
          message = 'Rate limit exceeded. Please wait a moment.'
        } else if (error.message.includes('Content too large') || error.message.includes('413')) {
          message = 'Content too large. Please try a shorter section or smaller request.'
        } else if (error.message.includes('All AI providers failed') || error.message.includes('503')) {
          message = 'AI service temporarily unavailable. Please try again later.'
        } else if (error.message.includes('Missing') || error.message.includes('required')) {
          message = error.message
        }
      }

      toast.error(message)
      if (previousContent) {
        setEditedContent(previousContent)
      }
    } finally {
      setIsAiLoading(false)
    }
  }

  const handleUndo = () => {
    if (previousContent !== null) {
      setEditedContent(previousContent)
      setPreviousContent(null)
      toast.info('Reverted to previous version')
    }
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
            <label htmlFor="section-edit-textarea" className="block text-sm font-medium text-slate-700 mb-2">Edit Mode:</label>
            <textarea
              id="section-edit-textarea"
              aria-label="Edit section content"
              disabled={isAiLoading}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-48 p-4 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
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
          {previousContent !== null && (
            <Button variant="outline" onClick={handleUndo} className="text-slate-600 bg-transparent gap-2">
              <RotateCcw className="w-4 h-4" />
              Undo AI Edit
            </Button>
          )}
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
