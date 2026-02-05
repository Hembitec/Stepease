"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, ArrowRight, Plus, Search, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ExpandedNoteCard } from "@/components/notes/expanded-note-card"
import { NoteEditorModal } from "@/components/notes/note-editor-modal"
import { useSOPContext } from "@/lib/sop-context"
import { CATEGORY_STYLES, type Note, type NoteCategory, type SOP } from "@/lib/types"
import { cn } from "@/lib/utils"

const categoryColors = CATEGORY_STYLES

const categories = [
  "All",
  "HEADER_INFO",
  "PURPOSE_SCOPE",
  "ROLES_RESPONSIBILITIES",
  "PROCEDURE_STEPS",
  "QUALITY_SUCCESS",
  "TROUBLESHOOTING",
]
const sortOptions = ["Chronological", "By Section", "By Priority"]

const missingCritical = [
  "No troubleshooting steps defined",
  "Quality metrics not specified",
  "Visual aids not discussed",
]

export default function ReviewNotesPage() {
  const router = useRouter()
  const params = useParams()
  const { sops, updateSOP, session, addSessionNotes, addSOP } = useSOPContext()

  // Try to find existing SOP, or use session notes for improvement mode
  const sop = sops.find((s) => s.id === params.id)
  const isImprovementMode = session?.metadata?.mode === 'improve'

  // Use session notes if in improvement mode and no SOP exists yet
  // Deduplicate notes by ID (in case of data corruption)
  const rawNotes = sop?.notes || session?.notes || []
  const initialNotes = rawNotes.filter((note, index, self) =>
    index === self.findIndex((n) => n.id === note.id)
  )

  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const [sortBy, setSortBy] = useState("Chronological")
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const filteredNotes = useMemo(() => {
    let result = [...notes]

    // Filter by category
    if (activeFilter !== "All") {
      result = result.filter((n) => n.category === activeFilter)
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (n) =>
          n.content.toLowerCase().includes(query) ||
          n.relatedTo.toLowerCase().includes(query) ||
          n.action.toLowerCase().includes(query),
      )
    }

    // Sort
    if (sortBy === "By Priority") {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    } else if (sortBy === "By Section") {
      result.sort((a, b) => a.category.localeCompare(b.category))
    }

    return result
  }, [notes, activeFilter, searchQuery, sortBy])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: notes.length }
    notes.forEach((n) => {
      counts[n.category] = (counts[n.category] || 0) + 1
    })
    return counts
  }, [notes])

  const handleSaveNote = (note: Note) => {
    if (notes.find((n) => n.id === note.id)) {
      setNotes(notes.map((n) => (n.id === note.id ? note : n)))
    } else {
      setNotes([...notes, note])
    }
    setEditingNote(null)
    setIsAddingNote(false)
  }

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id))
    setShowDeleteConfirm(null)
  }

  const handleGenerate = async () => {
    if (isGenerating) return // Prevent double clicks

    setIsGenerating(true)
    try {
      const sessionId = params.id as string

      // For improvement mode, update session notes first
      if (isImprovementMode && session) {
        addSessionNotes(notes)
      }
      // For regular mode, update SOP notes
      else if (sop) {
        updateSOP(sop.id, { notes })
      }

      // Build the request body with COMPLETE context for improvement mode
      const requestBody = isImprovementMode && session?.metadata
        ? {
          mode: 'improve',
          notes,
          title: session?.title || 'Standard Operating Procedure',
          // Pass the original SOP content
          originalContent: session.metadata.originalContent || '',
          // Pass the analysis results
          analysis: session.metadata.analysisResult || null,
          // Pass the conversation history
          conversationHistory: session.messages || [],
        }
        : {
          mode: 'create',
          notes,
          title: sop?.title || session?.title || 'Standard Operating Procedure',
        }

      // Call the generation API with full context
      const response = await fetch('/api/chat/generate-sop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error('Failed to generate SOP')
      }

      // Stream the response - toTextStreamResponse() returns plain text chunks
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let generatedContent = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          // Plain text stream - just concatenate the chunks directly
          generatedContent += decoder.decode(value, { stream: true })
        }
        // Flush any remaining bytes
        generatedContent += decoder.decode()
      }

      console.log('[Generate SOP] Content length:', generatedContent.length)

      // Update the SOP/session with the generated content
      if (!sop) {
        // SOP doesn't exist, create it (common in improvement mode)
        const newSOP: SOP = {
          id: sessionId,
          title: session?.title || 'Standard Operating Procedure',
          status: 'draft',
          content: generatedContent,
          notes,
          chatHistory: session?.messages || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sessionId: session?.id, // Link back to original session
        }
        await addSOP(newSOP)
      } else {
        // SOP exists, update it
        await updateSOP(sop.id, {
          content: generatedContent,
          notes,
          status: 'draft'
        })
      }

      // Navigate to preview after database write completes
      router.push(`/preview/${sessionId}`)
    } catch (error) {
      console.error('Generation error:', error)
      alert('Failed to generate SOP. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back to Chat</span>
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Review & Edit Notes</h1>
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 disabled:opacity-70"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              Generate SOP
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Title & Count */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">All Conversation Notes ({notes.length} total)</h2>
          <p className="text-gray-600">Review and edit notes before generating your SOP</p>
        </div>

        {/* Filters & Search */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 flex-1">
              {categories.map((cat) => {
                const count = categoryCounts[cat] || 0
                const colors = cat === "All" ? { bg: "bg-gray-100", text: "text-gray-700" } : (categoryColors[cat as NoteCategory] || categoryColors.OTHER)
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-full transition-all flex items-center gap-1",
                      activeFilter === cat
                        ? `${colors?.bg} ${colors?.text} ring-2 ring-blue-500`
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                    )}
                  >
                    {cat === "All" ? "All" : cat.replace(/_/g, " ")}
                    <span className="bg-white/50 px-1.5 rounded-full text-xs">{count}</span>
                  </button>
                )
              })}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map((opt) => (
                <option key={opt} value={opt}>
                  Sort: {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Notes List */}
        <div className="space-y-4 mb-6">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <ExpandedNoteCard
                key={note.id}
                note={note}
                onEdit={setEditingNote}
                onDelete={(id) => setShowDeleteConfirm(id)}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
              <p className="text-gray-500">No notes match your filters</p>
            </div>
          )}
        </div>

        {/* Add Manual Note */}
        <Button
          variant="outline"
          onClick={() => setIsAddingNote(true)}
          className="w-full border-dashed border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 mb-6 bg-transparent"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Manual Note
        </Button>

        {/* Missing Critical Info Warning */}
        {missingCritical.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800 mb-2">Missing Critical Information</h3>
                <p className="text-sm text-yellow-700 mb-3">The following sections need attention:</p>
                <ul className="space-y-1">
                  {missingCritical.map((item, index) => (
                    <li key={index} className="text-sm text-yellow-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="text-yellow-700 border-yellow-300 hover:bg-yellow-100 bg-transparent"
                  >
                    Back to Chat to Address
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white disabled:opacity-70"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      'Generate Anyway'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generate CTA */}
        <div className="flex justify-end">
          <Button
            onClick={handleGenerate}
            size="lg"
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-8 disabled:opacity-70"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating SOP...
              </>
            ) : (
              <>
                Generate Complete SOP
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </main>

      {/* Note Editor Modal */}
      <NoteEditorModal
        note={editingNote}
        isOpen={!!editingNote || isAddingNote}
        onClose={() => {
          setEditingNote(null)
          setIsAddingNote(false)
        }}
        onSave={handleSaveNote}
        isNew={isAddingNote}
      />

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Note?</h3>
            <p className="text-gray-600 mb-6">Are you sure? This cannot be undone.</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(null)} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button
                onClick={() => handleDeleteNote(showDeleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
