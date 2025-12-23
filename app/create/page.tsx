"use client"

// =============================================================================
// STEPWISE - CREATE SOP PAGE
// Main interface for AI-powered SOP creation with 5-phase conversation flow
// =============================================================================

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { experimental_useObject as useObject } from "@ai-sdk/react"
import { ArrowLeft, Save, FileEdit, MessageSquare, Bot, User, Send, PanelRightClose, PanelRightOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NotesPanel } from "@/components/notes/notes-panel"
import { PhaseBadge } from "@/components/chat/phase-indicator"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useSOPContext } from "@/lib/sop-context"
import { aiResponseSchema } from "@/lib/types"
import { cn } from "@/lib/utils"
import type { Note, ConversationPhase, SOP, ChatMessage, AIResponse } from "@/lib/types"
import { generateId } from "@/lib/types"

// -----------------------------------------------------------------------------
// Initial Greeting Message
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
          isAI ? "bg-gray-100 text-gray-900 rounded-tl-sm" : "bg-blue-600 text-white rounded-tr-sm"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
      {!isAI && (
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-gray-600" />
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
      <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export default function CreateSOPPage() {
  const router = useRouter()
  const { addSOP, session, startNewSession, addSessionNotes, setSessionPhase } = useSOPContext()

  // Local state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [currentPhase, setCurrentPhase] = useState<ConversationPhase>("foundation")
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState<"chat" | "notes">("chat")
  const [inputValue, setInputValue] = useState("")
  const [isNotesCollapsed, setIsNotesCollapsed] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize session on mount
  useEffect(() => {
    if (!session) {
      startNewSession()
    }
  }, [session, startNewSession])

  // -------------------------------------------------------------------------
  // Object Streaming Hook
  // -------------------------------------------------------------------------

  const { object, submit, isLoading } = useObject({
    api: "/api/chat/sop",
    schema: aiResponseSchema,
    onFinish: ({ object }) => {
      if (!object) return

      // Add assistant message to history
      const aiMessage: ChatMessage = {
        id: generateId("msg"),
        role: "ai",
        content: object.message || "",
        timestamp: new Date().toISOString(),
      }
      setChatHistory((prev) => [...prev, aiMessage])

      // Extract and add notes
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

      // Update phase and progress
      if (object.phase) {
        setCurrentPhase(object.phase as ConversationPhase)
        setSessionPhase(object.phase as ConversationPhase, object.progress || 0)
      }

      if (typeof object.progress === "number") {
        setProgress(object.progress)
      }
    },
  })

  // -------------------------------------------------------------------------
  // Scroll to Bottom
  // -------------------------------------------------------------------------

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory, object, isLoading, scrollToBottom])

  // -------------------------------------------------------------------------
  // Message Sending
  // -------------------------------------------------------------------------

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

    // Use current mode and messages for the request
    submit({
      messages: newHistory,
      mode: "create"
    })
  }, [inputValue, isLoading, chatHistory, submit])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSendMessage()
      }
    },
    [handleSendMessage]
  )

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------

  const handleSaveDraft = useCallback(() => {
    const newSOP: SOP = {
      id: `sop-${Date.now()}`,
      title: "New SOP Draft",
      department: "General",
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content: "",
      notes,
      chatHistory,
    }
    addSOP(newSOP)
    router.push("/dashboard")
  }, [notes, chatHistory, addSOP, router])

  const handleReview = useCallback(() => {
    const sopId = `sop-${Date.now()}`
    const newSOP: SOP = {
      id: sopId,
      title: "New SOP",
      department: "General",
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content: "",
      notes,
      chatHistory,
    }
    addSOP(newSOP)
    router.push(`/review/${sopId}`)
  }, [notes, chatHistory, addSOP, router])

  const handleDeleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }, [])

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

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
            {/* Notes Panel Toggle - Desktop only */}
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
              {/* Initial greeting */}
              <MessageBubble role="assistant" content={INITIAL_GREETING} />

              {/* Chat history */}
              {chatHistory.map((message) => (
                <MessageBubble
                  key={message.id}
                  role={message.role === "ai" ? "assistant" : "user"}
                  content={message.content}
                />
              ))}

              {/* Current streaming message */}
              {isLoading && object && object.message && (
                <MessageBubble role="assistant" content={object.message} />
              )}

              {/* Loading indicator */}
              {isLoading && !object?.message && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 bg-white p-3 sm:p-4 flex-shrink-0">
              <div className="flex gap-2 sm:gap-3 items-end">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your response here..."
                  disabled={isLoading}
                  className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 min-h-[48px] max-h-[120px]"
                  rows={1}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-12 w-12 rounded-xl p-0"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Notes Panel - Desktop */}
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
            />
          </div>

          {/* Notes Panel - Mobile */}
          <div className={cn("flex-1 lg:hidden", activeTab === "chat" ? "hidden" : "flex flex-col")}>
            <NotesPanel
              notes={notes}
              onDeleteNote={handleDeleteNote}
              onReview={handleReview}
              progress={progress}
              phase={currentPhase}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
