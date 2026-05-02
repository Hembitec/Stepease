"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, ArrowRight, Plus, Search, AlertTriangle, Loader2, ShieldCheck, Sparkles, CheckCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ExpandedNoteCard } from "@/components/notes/expanded-note-card"
import { NoteEditorModal } from "@/components/notes/note-editor-modal"
import { useSOPContext } from "@/lib/sop-context"
import { CATEGORY_STYLES, type Note, type NoteCategory, type SOP, NOTE_CATEGORIES } from "@/lib/types"
import { cn } from "@/lib/utils"

const categoryColors = CATEGORY_STYLES

// The "Ghost Document" skeleton order
const ORDERED_CATEGORIES: NoteCategory[] = [
  "HEADER_INFO",
  "PURPOSE_SCOPE",
  "ROLES_RESPONSIBILITIES",
  "PROCEDURE_STEPS",
  "DECISION_POINTS",
  "QUALITY_SUCCESS",
  "TROUBLESHOOTING",
  "DEFINITIONS_REFERENCES",
  "MATERIALS_RESOURCES",
]

const sortOptions = ["Chronological", "By Section", "By Priority"]

const missingCritical = [
  "No troubleshooting steps defined",
  "Quality metrics not specified",
]

export default function ReviewNotesPage() {
  const router = useRouter()
  const params = useParams()
  const { sops, updateSOP, session, addSessionNotes, addSOP } = useSOPContext()

  // Try to find existing SOP, or use session notes for improvement mode
  const sop = sops.find((s) => s.id === params.id || s.sessionId === params.id)
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
        // SOP doesn't exist, create it
        const metadata = (session?.metadata as Record<string, unknown>) || {}
        const isRevision = !!metadata.revisionOf
        const nextVersion = isRevision ? ((metadata.revisionFromVersion as number) ?? 1) + 1 : 1
        const parentSopId = isRevision ? (metadata.parentSopId as string) : undefined
        const titleBase = (session?.title || 'Standard Operating Procedure').replace(/\s*—\s*v\d+$/, '')

        const newSOP: SOP = {
          id: `sop-${Date.now()}`,
          title: nextVersion > 1 ? `${titleBase} — v${nextVersion}` : titleBase,
          status: 'draft',
          content: generatedContent,
          notes,
          chatHistory: session?.messages || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sessionId: session?.id, // Link back to original session
          version: nextVersion,
          parentSopId,
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
      // We push to the preview page using the sessionId, which the preview page can use to find the SOP
      router.push(`/preview/${session?.id || params.id}`)
    } catch (error) {
      console.error('Generation error:', error)
      alert('Failed to generate SOP. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button onClick={() => router.back()} className="text-slate-500 hover:text-slate-900 shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5 min-w-0">
              <Sparkles className="w-4 h-4 text-blue-500 fill-blue-50 shrink-0 hidden xs:block" />
              <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate">Review Notes</h1>
            </div>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 px-3 sm:px-5 h-9 rounded-lg font-bold shadow-md shadow-blue-600/10 transition-all active:scale-95 shrink-0 group"
          >
            {isGenerating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <span className="hidden xs:inline">Generate</span>
                <span className="xs:hidden">Build</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
        {/* Title & Progress */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1.5">Procedural Architecture</h2>
            <p className="text-sm text-slate-500 max-w-lg leading-relaxed">
              Verify your captured knowledge mapped to standard SOP sections.
            </p>
          </div>
          
          <div className="bg-white border border-slate-200 p-3 sm:p-4 rounded-xl shadow-sm w-full md:min-w-[200px] md:w-auto">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              <span>Coverage</span>
              <span className="text-blue-600">{Math.round((notes.map(n => n.category).filter((v, i, a) => a.indexOf(v) === i).length / ORDERED_CATEGORIES.length) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-1000 ease-out-expo" 
                style={{ width: `${(notes.map(n => n.category).filter((v, i, a) => a.indexOf(v) === i).length / ORDERED_CATEGORIES.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Refinement Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-10 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search captured details..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              {sortOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ghost Document Structure */}
        <div className="space-y-8 sm:space-y-10 mb-10">
          {ORDERED_CATEGORIES.map((cat) => {
            const categoryNotes = filteredNotes.filter((n) => n.category === cat)
            const style = categoryColors[cat] || categoryColors.OTHER
            const hasNotes = categoryNotes.length > 0

            return (
              <section key={cat} className="relative">
                {/* Section Header */}
                <div className="flex items-center gap-2.5 mb-3">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", style.bg, style.text)}>
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-none mb-0.5">{style.label}</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
                      {hasNotes ? `${categoryNotes.length} captured` : "Empty"}
                    </p>
                  </div>
                </div>

                {/* Content Area */}
                <div className={cn(
                  "rounded-xl transition-all duration-300",
                  hasNotes 
                    ? "space-y-3" 
                    : "border border-dashed border-slate-200 bg-slate-50/50 p-6 flex flex-col items-center justify-center text-center group hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer"
                )}
                onClick={!hasNotes ? () => {
                  setIsAddingNote(true)
                  setEditingNote({
                    id: `manual-${Date.now()}`,
                    category: cat,
                    priority: 'medium',
                    timestamp: new Date().toISOString(),
                    source: 'Manual',
                    content: '',
                    relatedTo: style.label,
                    action: 'Add to SOP'
                  })
                } : undefined}
                >
                  {hasNotes ? (
                    categoryNotes.map((note) => (
                      <ExpandedNoteCard
                        key={note.id}
                        note={note}
                        onEdit={setEditingNote}
                        onDelete={(id) => setShowDeleteConfirm(id)}
                      />
                    ))
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-2 text-slate-400 group-hover:text-blue-500 group-hover:scale-110 transition-all shadow-sm">
                        <Plus className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-bold text-slate-600 group-hover:text-blue-700 transition-colors uppercase tracking-tight">
                        Add {style.label}
                      </p>
                    </>
                  )}
                </div>
              </section>
            )
          })}
        </div>

        {/* Global Add Button */}
        <div className="flex justify-center mb-10">
          <Button
            variant="outline"
            onClick={() => setIsAddingNote(true)}
            size="sm"
            className="rounded-full px-5 border-slate-300 text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm gap-2 h-9 text-xs font-bold uppercase tracking-wider"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Detail
          </Button>
        </div>

        {/* AI Quality Audit Section - COMPACT */}
        {missingCritical.length > 0 && (
          <div className="bg-slate-900 rounded-2xl p-5 sm:p-6 mb-10 relative overflow-hidden border border-slate-800">
            <div className="relative flex flex-col sm:flex-row gap-4 sm:items-center">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center shrink-0 border border-blue-500/20">
                <ShieldCheck className="w-6 h-6 text-blue-400" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Quality Audit</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Refinement Opportunities</h3>
                
                <div className="flex flex-wrap gap-2 mb-5">
                  {missingCritical.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/50 px-3 py-1.5 rounded-lg">
                      <div className="w-1 h-1 bg-blue-500 rounded-full shrink-0" />
                      <span className="text-[11px] text-slate-300 font-semibold">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={() => router.back()}
                    size="sm"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent h-9 px-4 rounded-lg text-xs font-bold"
                  >
                    Back to Chat
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-500 text-white border-0 h-9 px-5 rounded-lg font-bold shadow-lg shadow-blue-600/10 transition-all active:scale-95 group text-xs"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        Generate Anyway
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generate CTA - Large & Minimal */}
        {!isGenerating && missingCritical.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 border-t border-slate-200 mt-8">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-6 border border-emerald-100">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Ready for Generation</h3>
            <p className="text-slate-500 text-center max-w-sm mb-8">
              All critical sections have been addressed. Click below to transform your notes into a professional SOP.
            </p>
            <Button
              onClick={handleGenerate}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white gap-3 px-12 h-14 rounded-2xl font-bold shadow-xl shadow-blue-600/20 hover:scale-105 transition-all group"
            >
              Generate Complete SOP
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}

        {/* Show loading state when generating if missingCritical is empty */}
        {isGenerating && missingCritical.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-2">Building your procedure...</h3>
            <p className="text-slate-500 animate-pulse font-mono text-sm tracking-widest uppercase">Applying Surgical Edits</p>
          </div>
        )}
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-base font-semibold text-slate-900 mb-1.5">Delete Note?</h3>
            <p className="text-sm text-slate-500 mb-5">This action cannot be undone. The note will be permanently removed.</p>
            <div className="flex gap-2.5">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(null)} className="flex-1 bg-transparent text-sm">
                Cancel
              </Button>
              <Button
                onClick={() => handleDeleteNote(showDeleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm"
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
