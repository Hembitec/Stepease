"use client"

// =============================================================================
// Stepease - CREATE SOP PAGE
// Main interface for AI-powered SOP creation with 5-phase conversation flow
//
// Architecture:
//   CreateSOPPage          → Suspense boundary (export default)
//   CreateSOPPageContent   → Wrapper: reads URL, manages mountKey for session isolation
//   CreateSOPInner         → All UI/chat logic, fresh state on each session
// =============================================================================

import { useState, useRef, useEffect, useCallback, useMemo, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { experimental_useObject as useObject } from "@ai-sdk/react"
import { ArrowLeft, Save, FileEdit, MessageSquare, Bot, User, Send, PanelRightClose, PanelRightOpen, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NotesPanel } from "@/components/notes/notes-panel"
import { PhaseBadge } from "@/components/chat/phase-indicator"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useSOPContext } from "@/lib/sop-context"
import { aiResponseSchema } from "@/lib/types"
import { cn } from "@/lib/utils"
import type { Note, ConversationPhase, SOP, ChatMessage, AIResponse } from "@/lib/types"
import { generateId } from "@/lib/types"
import {
  generateImprovementGreeting,
  initializeImprovementStatus,
  type ImprovementStatus
} from "@/lib/improvement-helpers"
import type { AnalysisResult } from "@/lib/sop-analyzer"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const INITIAL_GREETING =
  "Hello! I'm here to help you create a professional SOP. Let's start with the basics.\n\nWhat process or procedure would you like to document today?"

// -----------------------------------------------------------------------------
// Message Bubble Component
// -----------------------------------------------------------------------------

interface MessageBubbleProps {
  role: "user" | "assistant"
  content: string
}

function MessageBubble({ role, content }: MessageBubbleProps) {
  const isAI = role === "assistant"

  return (
    <div className={cn("flex gap-3 mb-4", isAI ? "justify-start" : "justify-end")}>
      {isAI && (
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[85%] sm:max-w-[80%] px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl",
          isAI ? "bg-slate-100 text-slate-900 rounded-tl-sm" : "bg-blue-600 text-white rounded-tr-sm"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
      {!isAI && (
        <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-slate-600" />
        </div>
      )}
    </div>
  )
}

// -----------------------------------------------------------------------------
// Typing Indicator Component
// -----------------------------------------------------------------------------

function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-4 justify-start">
      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// CreateSOPInner — All UI/Chat Logic
// This component is KEYED by session ID in the parent wrapper.
// When the key changes (session switch), React unmounts and remounts this,
// giving us completely fresh useState hooks — zero stale state.
// =============================================================================

function CreateSOPInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode') ?? 'create'
  const isImprovementMode = mode === 'improve'
  const sessionIdFromUrl = searchParams.get('session')

  // Context
  const {
    addSOP, session, activeSessionId,
    startNewSession, resumeSession,
    addSessionMessage, addSessionNotes,
    setSessionPhase, updateSessionTitle,
  } = useSOPContext()

  // Limit checks
  const canCreateData = useQuery(api.users.checkCanCreate)
  const canImproveData = useQuery(api.users.checkCanImprove)

  // ---------------------------------------------------------------------------
  // Local UI State (fresh on every mount thanks to parent keying)
  // ---------------------------------------------------------------------------
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [currentPhase, setCurrentPhase] = useState<ConversationPhase>("foundation")
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState<"chat" | "notes">("chat")
  const [inputValue, setInputValue] = useState("")
  const [isNotesCollapsed, setIsNotesCollapsed] = useState(false)
  const [improvementStatus, setImprovementStatus] = useState<Record<string, ImprovementStatus>>({})
  const [dataLoaded, setDataLoaded] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // ---------------------------------------------------------------------------
  // EFFECT 1: Limit Check — redirect if at limit (new sessions only)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (sessionIdFromUrl || activeSessionId) return // resuming — skip limit check
    if (isImprovementMode && canImproveData && !canImproveData.canImprove) {
      router.replace('/dashboard')
    } else if (!isImprovementMode && canCreateData && !canCreateData.canCreate) {
      router.replace('/dashboard')
    }
  }, [canCreateData, canImproveData, isImprovementMode, sessionIdFromUrl, activeSessionId, router])

  // ---------------------------------------------------------------------------
  // EFFECT 2: Session Initialization (runs once on mount)
  //   - If URL has ?session=X → tell Context to resume session X
  //   - If no URL param → tell Context to start a new local session
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (sessionIdFromUrl) {
      // Resume existing session — tell Context which session to load
      if (!session || session.id !== sessionIdFromUrl) {
        resumeSession(sessionIdFromUrl)
      }
    } else if (!isImprovementMode) {
      // New session — create a local placeholder (lazy creation on first message)
      if (!session || activeSessionId) {
        startNewSession()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Intentionally empty — runs ONCE on mount. Parent keying handles re-init.

  // ---------------------------------------------------------------------------
  // EFFECT 3: URL Update after Lazy Creation
  //   When user sends first message → session is created in DB → activeSessionId set
  //   We update the URL so refresh/bookmark works.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (activeSessionId && !sessionIdFromUrl) {
      const newUrl = `/create?session=${activeSessionId}${mode !== 'create' ? `&mode=${mode}` : ''}`
      router.replace(newUrl, { scroll: false })
    }
  }, [activeSessionId, sessionIdFromUrl, router, mode])

  // ---------------------------------------------------------------------------
  // EFFECT 4: Load Session Data into local state
  //   When Context.session becomes available with the correct data, seed local state.
  //   Guard: only load if data matches what we expect (URL session ID).
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!session || dataLoaded) return

    // Guard: if URL expects a specific session, only load matching data
    if (sessionIdFromUrl && session.id !== sessionIdFromUrl) return

    // Seed local state from session
    if (session.messages && session.messages.length > 0) {
      setChatHistory(session.messages)
    }
    if (session.notes && session.notes.length > 0) {
      setNotes(session.notes)
    }
    setCurrentPhase(session.phase)
    setProgress(session.phaseProgress)

    if (isImprovementMode && session.metadata?.analysisResult) {
      setImprovementStatus(initializeImprovementStatus(session.metadata.analysisResult))
    }

    setDataLoaded(true)
  }, [session, dataLoaded, sessionIdFromUrl, isImprovementMode])

  // ---------------------------------------------------------------------------
  // Object Streaming Hook
  // ---------------------------------------------------------------------------

  const { object, submit, isLoading } = useObject({
    api: "/api/chat/sop",
    schema: aiResponseSchema,
    onFinish: ({ object }) => {
      if (!object) return

      const aiMessage: ChatMessage = {
        id: generateId("msg"),
        role: "ai",
        content: object.message || "",
        timestamp: new Date().toISOString(),
      }
      setChatHistory((prev) => [...prev, aiMessage])
      addSessionMessage(aiMessage)

      if (object.notes && object.notes.length > 0) {
        const newNotes: Note[] = object.notes.map((n) => ({
          id: generateId("note"),
          category: n.category as any,
          priority: n.priority,
          timestamp: new Date().toISOString(),
          source: "AI Extraction",
          content: n.content,
          relatedTo: n.relatedTo,
          action: n.action,
        }))
        setNotes((prev) => [...prev, ...newNotes])
        addSessionNotes(newNotes)
      }

      if (object.phase) {
        setCurrentPhase(object.phase as ConversationPhase)
        setSessionPhase(object.phase as ConversationPhase, object.progress || 0)
      }

      if (typeof object.progress === "number") {
        setProgress(object.progress)
      }

      if (object.title && session?.title &&
        (session.title === "New SOP" || session.title === "New SOP Draft" || session.title === "SOP Improvement")) {
        updateSessionTitle(object.title)
      }
    },
  })

  // ---------------------------------------------------------------------------
  // Scroll to Bottom
  // ---------------------------------------------------------------------------

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory, object, isLoading, scrollToBottom])

  // ---------------------------------------------------------------------------
  // Greeting
  // ---------------------------------------------------------------------------

  const initialGreeting = useMemo(() => {
    if (isImprovementMode && session?.metadata?.analysisResult) {
      return generateImprovementGreeting(session.metadata.analysisResult)
    }
    return INITIAL_GREETING
  }, [isImprovementMode, session])

  // ---------------------------------------------------------------------------
  // Message Sending
  // ---------------------------------------------------------------------------

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: generateId("msg"),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    }

    const newHistory = [...chatHistory, userMessage]
    setChatHistory(newHistory)
    setInputValue("")

    addSessionMessage(userMessage)

    submit({
      messages: newHistory,
      mode: mode,
      existingNotes: notes.length > 0 ? notes.map(n => ({
        category: n.category,
        content: n.content,
        relatedTo: n.relatedTo,
      })) : undefined,
      ...(isImprovementMode && session?.metadata?.analysisResult && {
        analysisContext: session.metadata.analysisResult
      })
    })
  }, [inputValue, isLoading, chatHistory, submit, mode, isImprovementMode, session, notes, addSessionMessage])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSendMessage()
      }
    },
    [handleSendMessage]
  )

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  const handleSaveDraft = useCallback(() => {
    const newSOP: SOP = {
      id: `sop-${Date.now()}`,
      title: session?.title || "New SOP Draft",
      department: "General",
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content: "",
      notes,
      chatHistory,
      sessionId: session?.id,
    }
    addSOP(newSOP)
    router.push("/dashboard")
  }, [notes, chatHistory, addSOP, router, session?.id, session?.title])

  const handleReview = useCallback(() => {
    const sopId = `sop-${Date.now()}`
    const newSOP: SOP = {
      id: sopId,
      title: session?.title || "New SOP",
      department: "General",
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content: "",
      notes,
      chatHistory,
      sessionId: session?.id,
    }
    addSOP(newSOP)
    router.push(`/review/${sopId}`)
  }, [notes, chatHistory, addSOP, router, session?.id, session?.title])

  const handleDeleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }, [])

  // Track improvement status when notes change
  useEffect(() => {
    if (isImprovementMode && session?.metadata?.analysisResult) {
      const analysis = session.metadata.analysisResult
      const newStatus = { ...improvementStatus }

      analysis.improvements.forEach((imp: AnalysisResult['improvements'][0], idx: number) => {
        const isAddressed = notes.some(note => {
          const noteContent = note.content.toLowerCase()
          const impDesc = imp.description.toLowerCase()
          const impCategory = imp.category.toLowerCase()

          return (
            noteContent.includes(impDesc.slice(0, 30)) ||
            note.relatedTo?.toLowerCase().includes(impCategory) ||
            (note.category === 'GAPS_IMPROVEMENTS' && noteContent.includes(impDesc.slice(0, 20)))
          )
        })

        if (isAddressed && newStatus[`improvement-${idx}`] !== 'addressed') {
          newStatus[`improvement-${idx}`] = 'addressed'
        }
      })

      setImprovementStatus(newStatus)
    }
  }, [notes, isImprovementMode, session])

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <DashboardLayout fullHeight>
      <div className="h-full flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-slate-500 hover:text-slate-700 flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-slate-900 hidden sm:block">Creating New SOP</h1>
            <PhaseBadge phase={currentPhase} progress={progress} />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsNotesCollapsed(!isNotesCollapsed)}
              className="hidden lg:flex"
              title={isNotesCollapsed ? "Show Notes Panel" : "Hide Notes Panel"}
            >
              {isNotesCollapsed ? (
                <PanelRightOpen className="w-5 h-5" />
              ) : (
                <PanelRightClose className="w-5 h-5" />
              )}
            </Button>
            <Button variant="outline" onClick={handleSaveDraft} className="gap-2 bg-white">
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save Draft</span>
            </Button>
          </div>
        </header>

        {/* Mobile Tab Navigation */}
        <div className="lg:hidden flex border-b border-slate-200 bg-white flex-shrink-0">
          <button
            onClick={() => setActiveTab("chat")}
            className={cn(
              "flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors",
              activeTab === "chat"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <MessageSquare className="w-4 h-4" />
            Chat
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={cn(
              "flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors",
              activeTab === "notes"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <FileEdit className="w-4 h-4" />
            Notes ({notes.length})
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Area */}
          <div
            className={cn(
              "flex-1 flex flex-col bg-white",
              activeTab === "notes" ? "hidden lg:flex" : "flex",
              !isNotesCollapsed && "lg:border-r border-slate-200"
            )}
          >
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
              {/* Initial greeting — only when chat is empty */}
              {chatHistory.length === 0 && (
                <MessageBubble role="assistant" content={initialGreeting} />
              )}

              {chatHistory.map((message, index) => (
                <MessageBubble
                  key={message.id || `msg-${index}`}
                  role={message.role === "ai" ? "assistant" : "user"}
                  content={message.content}
                />
              ))}

              {isLoading && object && object.message && (
                <MessageBubble role="assistant" content={object.message} />
              )}

              {isLoading && !object?.message && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-200/80 bg-gradient-to-t from-slate-50/80 to-white p-3 sm:p-4 flex-shrink-0">
              <div className="relative flex items-end gap-2 bg-white border border-slate-200 rounded-2xl shadow-sm focus-within:border-blue-400 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all duration-200">
                <textarea
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value)
                    // Auto-resize
                    const target = e.target
                    target.style.height = 'auto'
                    target.style.height = `${Math.min(target.scrollHeight, 150)}px`
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your process or answer the question..."
                  disabled={isLoading}
                  className="flex-1 resize-none bg-transparent border-0 px-4 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 disabled:opacity-50 min-h-[48px] max-h-[150px] leading-relaxed"
                  rows={1}
                />
                <div className="flex items-center gap-1.5 pr-2 pb-2.5">
                  {!inputValue.trim() && !isLoading && (
                    <span className="text-[11px] text-slate-300 hidden sm:inline whitespace-nowrap mr-1">
                      Enter ↵
                    </span>
                  )}
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className={cn(
                      "flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200",
                      inputValue.trim() && !isLoading
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/30 scale-100 hover:scale-105"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    )}
                  >
                    <Send className={cn("w-4 h-4 transition-transform duration-200", inputValue.trim() && !isLoading && "-rotate-45")} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Panel — Desktop */}
          <div
            className={cn(
              "hidden lg:flex flex-col transition-all duration-300",
              isNotesCollapsed ? "w-0 overflow-hidden" : "w-96"
            )}
          >
            <NotesPanel
              notes={notes}
              onDeleteNote={handleDeleteNote}
              onReview={handleReview}
              progress={progress}
              phase={currentPhase}
              isImprovementMode={isImprovementMode}
              analysisResult={session?.metadata?.analysisResult}
              improvementStatus={improvementStatus}
            />
          </div>

          {/* Notes Panel — Mobile */}
          <div className={cn("flex-1 lg:hidden", activeTab === "chat" ? "hidden" : "flex flex-col")}>
            <NotesPanel
              notes={notes}
              onDeleteNote={handleDeleteNote}
              onReview={handleReview}
              progress={progress}
              phase={currentPhase}
              isImprovementMode={isImprovementMode}
              analysisResult={session?.metadata?.analysisResult}
              improvementStatus={improvementStatus}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// =============================================================================
// CreateSOPPageContent — Wrapper for Session Key Management
//
// This component solves the state bleeding problem:
//   - Reads the session ID from the URL
//   - Assigns a React `key` to CreateSOPInner based on session ID
//   - When session ID changes (SOP#1 → SOP#2), key changes → React UNMOUNTS
//     the old CreateSOPInner and MOUNTS a new one → all useState hooks reset
//   - EXCEPTION: Lazy creation (null → sessionId123) does NOT change the key,
//     because we want to preserve the user's in-progress chat state
// =============================================================================

function CreateSOPPageContent() {
  const searchParams = useSearchParams()
  const { session } = useSOPContext()

  const sessionIdFromUrl = searchParams.get('session')

  // mountKey drives React remounting. We track it in state so we can
  // selectively NOT update it during lazy creation.
  const [mountKey, setMountKey] = useState<string>(sessionIdFromUrl || "new")
  const prevUrlRef = useRef<string | null>(sessionIdFromUrl)

  useEffect(() => {
    const currentUrlId = searchParams.get('session')
    const prevUrlId = prevUrlRef.current

    if (currentUrlId !== prevUrlId) {
      // URL changed. Should we remount?
      // Lazy creation: URL goes from null → ID, AND context.session already matches
      // (because we just created it). In this case, DON'T remount.
      const isLazyCreation = prevUrlId === null && currentUrlId !== null && session?.id === currentUrlId

      if (!isLazyCreation) {
        // Session switch — change key to force remount
        setMountKey(currentUrlId || `new-${Date.now()}`)
      }

      prevUrlRef.current = currentUrlId
    }
  }, [searchParams, session?.id])

  return <CreateSOPInner key={mountKey} />
}

// =============================================================================
// CreateSOPPage — Top-level Export (Suspense boundary)
// =============================================================================

export default function CreateSOPPage() {
  return (
    <Suspense fallback={
      <DashboardLayout fullHeight>
        <div className="h-full flex items-center justify-center">
          <div className="text-slate-500">Loading...</div>
        </div>
      </DashboardLayout>
    }>
      <CreateSOPPageContent />
    </Suspense>
  )
}
