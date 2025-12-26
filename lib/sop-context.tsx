"use client"

// =============================================================================
// STEPWISE - SOP CONTEXT PROVIDER
// Global state management for SOP creation with 5-phase conversation flow
// =============================================================================

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import {
  type Note,
  type ChatMessage,
  type SOP,
  type SessionState,
  type ConversationPhase,
  generateId,
  getNextPhase,
  calculateOverallProgress,
} from "./types"
import type { AnalysisResult } from "./sop-analyzer"

// -----------------------------------------------------------------------------
// Mock Data for Initial State
// -----------------------------------------------------------------------------

const MOCK_SOPS: SOP[] = [
  {
    id: "sop-001",
    title: "Invoice Approval Procedure v2.0",
    department: "Finance",
    status: "complete",
    createdAt: "2025-12-18T10:00:00Z",
    updatedAt: "2025-12-20T08:30:00Z",
    content: `# Invoice Approval Procedure v2.0\n\n**Document ID:** SOP-FIN-001\n**Version:** 2.0\n**Effective Date:** December 20, 2025\n\n## 1. PURPOSE\nThis SOP establishes standardized procedures for invoice approval.\n\n## 2. SCOPE\nApplies to Accounts Payable team and all department managers.\n\n## 3. PROCEDURE\n1. Receive invoice\n2. Verify details\n3. Route for approval\n4. Process payment`,
    notes: [],
    chatHistory: [],
  },
  {
    id: "sop-002",
    title: "Employee Onboarding Process",
    department: "HR",
    status: "draft",
    createdAt: "2025-12-19T14:00:00Z",
    updatedAt: "2025-12-19T16:45:00Z",
    content: "# Employee Onboarding Process\n\n*Draft in progress...*",
    notes: [],
    chatHistory: [],
  },
]

// -----------------------------------------------------------------------------
// Context Types
// -----------------------------------------------------------------------------

interface SOPContextType {
  // SOP Library
  sops: SOP[]
  currentSOP: SOP | null
  setCurrentSOP: (sop: SOP | null) => void
  addSOP: (sop: SOP) => void
  updateSOP: (id: string, updates: Partial<SOP>) => void
  deleteSOP: (id: string) => void

  // Note Management
  addNote: (sopId: string, note: Note) => void
  updateNote: (sopId: string, noteId: string, updates: Partial<Note>) => void
  deleteNote: (sopId: string, noteId: string) => void

  // Message Management
  addMessage: (sopId: string, message: ChatMessage) => void

  // Session Management (for active creation)
  session: SessionState | null
  startNewSession: () => string
  startImprovementSession: (content: string, analysis: AnalysisResult) => string
  updateSession: (updates: Partial<SessionState>) => void
  endSession: () => void

  // Session Notes
  addSessionNote: (note: Note) => void
  addSessionNotes: (notes: Note[]) => void
  updateSessionNote: (noteId: string, updates: Partial<Note>) => void
  deleteSessionNote: (noteId: string) => void

  // Session Messages
  addSessionMessage: (message: ChatMessage) => void

  // Phase Management
  setSessionPhase: (phase: ConversationPhase, progress?: number) => void
  advancePhase: () => void

  // Finalization
  finalizeSession: (title?: string, department?: string) => SOP | null

  // Utilities
  getSessionNotesByCategory: () => Record<string, Note[]>
  getSessionProgress: () => number
}

const SOPContext = createContext<SOPContextType | undefined>(undefined)

// -----------------------------------------------------------------------------
// Provider Component
// -----------------------------------------------------------------------------

export function SOPProvider({ children }: { children: ReactNode }) {
  // SOP Library State
  const [sops, setSops] = useState<SOP[]>(MOCK_SOPS)
  const [currentSOP, setCurrentSOP] = useState<SOP | null>(null)

  // Active Session State
  const [session, setSession] = useState<SessionState | null>(null)

  // -------------------------------------------------------------------------
  // SOP CRUD Operations
  // -------------------------------------------------------------------------

  const addSOP = useCallback((sop: SOP) => {
    setSops((prev) => [...prev, sop])
  }, [])

  const updateSOP = useCallback((id: string, updates: Partial<SOP>) => {
    setSops((prev) =>
      prev.map((sop) =>
        sop.id === id
          ? { ...sop, ...updates, updatedAt: new Date().toISOString() }
          : sop
      )
    )

    // Update currentSOP if it's the one being modified
    if (currentSOP?.id === id) {
      setCurrentSOP((prev) => (prev ? { ...prev, ...updates } : null))
    }
  }, [currentSOP?.id])

  const deleteSOP = useCallback((id: string) => {
    setSops((prev) => prev.filter((sop) => sop.id !== id))
    if (currentSOP?.id === id) {
      setCurrentSOP(null)
    }
  }, [currentSOP?.id])

  // -------------------------------------------------------------------------
  // Note Operations (for saved SOPs)
  // -------------------------------------------------------------------------

  const addNote = useCallback((sopId: string, note: Note) => {
    setSops((prev) =>
      prev.map((sop) =>
        sop.id === sopId
          ? { ...sop, notes: [...sop.notes, note], updatedAt: new Date().toISOString() }
          : sop
      )
    )
  }, [])

  const updateNote = useCallback((sopId: string, noteId: string, updates: Partial<Note>) => {
    setSops((prev) =>
      prev.map((sop) =>
        sop.id === sopId
          ? {
            ...sop,
            notes: sop.notes.map((n) => (n.id === noteId ? { ...n, ...updates } : n)),
            updatedAt: new Date().toISOString(),
          }
          : sop
      )
    )
  }, [])

  const deleteNote = useCallback((sopId: string, noteId: string) => {
    setSops((prev) =>
      prev.map((sop) =>
        sop.id === sopId
          ? {
            ...sop,
            notes: sop.notes.filter((n) => n.id !== noteId),
            updatedAt: new Date().toISOString(),
          }
          : sop
      )
    )
  }, [])

  // -------------------------------------------------------------------------
  // Message Operations (for saved SOPs)
  // -------------------------------------------------------------------------

  const addMessage = useCallback((sopId: string, message: ChatMessage) => {
    setSops((prev) =>
      prev.map((sop) =>
        sop.id === sopId
          ? { ...sop, chatHistory: [...sop.chatHistory, message] }
          : sop
      )
    )
  }, [])

  // -------------------------------------------------------------------------
  // Session Management
  // -------------------------------------------------------------------------

  const startNewSession = useCallback((): string => {
    const newId = generateId("session")
    const newSession: SessionState = {
      id: newId,
      title: "New SOP",
      messages: [],
      notes: [],
      phase: "foundation",
      phaseProgress: 0,
      questionsAsked: 0,
      createdAt: new Date().toISOString(),
    }
    setSession(newSession)
    return newId
  }, [])

  const startImprovementSession = useCallback((content: string, analysis: AnalysisResult): string => {
    const newId = generateId("session")

    // Create initial notes from analysis improvements
    const improvementNotes: Note[] = analysis.improvements.map(imp => ({
      id: generateId("note"),
      category: "GAPS_IMPROVEMENTS",
      priority: imp.priority.toLowerCase() as "high" | "medium" | "low",
      content: `${imp.description} - Suggestion: ${imp.suggestion}`,
      timestamp: new Date().toISOString(),
      source: "AI Extraction",
      relatedTo: imp.category,
      action: "Needs addressing",
    }))

    const newSession: SessionState = {
      id: newId,
      title: "SOP Improvement",
      messages: [], // Start with empty messages - AI greeting will be shown separately
      notes: improvementNotes,
      phase: "foundation", // Start at foundation to re-verify basics
      phaseProgress: 0,
      questionsAsked: 0,
      createdAt: new Date().toISOString(),
      metadata: {
        mode: "improve",
        originalContent: content, // Store original SOP for AI context
        analysisResult: analysis
      }
    }

    setSession(newSession)
    return newId
  }, [])

  const updateSession = useCallback((updates: Partial<SessionState>) => {
    setSession((prev) => (prev ? { ...prev, ...updates } : null))
  }, [])

  const endSession = useCallback(() => {
    setSession(null)
  }, [])

  // -------------------------------------------------------------------------
  // Session Note Operations
  // -------------------------------------------------------------------------

  const addSessionNote = useCallback((note: Note) => {
    setSession((prev) =>
      prev ? { ...prev, notes: [...prev.notes, note] } : null
    )
  }, [])

  const addSessionNotes = useCallback((notes: Note[]) => {
    if (notes.length === 0) return
    setSession((prev) =>
      prev ? { ...prev, notes: [...prev.notes, ...notes] } : null
    )
  }, [])

  const updateSessionNote = useCallback((noteId: string, updates: Partial<Note>) => {
    setSession((prev) =>
      prev
        ? {
          ...prev,
          notes: prev.notes.map((n) =>
            n.id === noteId ? { ...n, ...updates } : n
          ),
        }
        : null
    )
  }, [])

  const deleteSessionNote = useCallback((noteId: string) => {
    setSession((prev) =>
      prev
        ? { ...prev, notes: prev.notes.filter((n) => n.id !== noteId) }
        : null
    )
  }, [])

  // -------------------------------------------------------------------------
  // Session Message Operations
  // -------------------------------------------------------------------------

  const addSessionMessage = useCallback((message: ChatMessage) => {
    setSession((prev) =>
      prev
        ? {
          ...prev,
          messages: [...prev.messages, message],
          questionsAsked: message.role === "ai" ? prev.questionsAsked + 1 : prev.questionsAsked,
        }
        : null
    )
  }, [])

  // -------------------------------------------------------------------------
  // Phase Management
  // -------------------------------------------------------------------------

  const setSessionPhase = useCallback((phase: ConversationPhase, progress?: number) => {
    setSession((prev) =>
      prev
        ? {
          ...prev,
          phase,
          phaseProgress: progress !== undefined ? progress : prev.phaseProgress,
        }
        : null
    )
  }, [])

  const advancePhase = useCallback(() => {
    setSession((prev) => {
      if (!prev) return null
      const nextPhase = getNextPhase(prev.phase)
      return {
        ...prev,
        phase: nextPhase,
        phaseProgress: 0,
      }
    })
  }, [])

  // -------------------------------------------------------------------------
  // Session Finalization
  // -------------------------------------------------------------------------

  const finalizeSession = useCallback((title?: string, department?: string): SOP | null => {
    if (!session) return null

    const newSOP: SOP = {
      id: session.id.replace("session", "sop"),
      title: title || session.title || "Untitled SOP",
      department: department || "General",
      status: "draft",
      createdAt: session.createdAt,
      updatedAt: new Date().toISOString(),
      notes: session.notes,
      chatHistory: session.messages,
      content: "",
    }

    addSOP(newSOP)
    setCurrentSOP(newSOP)
    setSession(null) // End the session

    return newSOP
  }, [session, addSOP])

  // -------------------------------------------------------------------------
  // Utility Functions
  // -------------------------------------------------------------------------

  const getSessionNotesByCategory = useCallback((): Record<string, Note[]> => {
    if (!session) return {}

    return session.notes.reduce((acc, note) => {
      if (!acc[note.category]) {
        acc[note.category] = []
      }
      acc[note.category].push(note)
      return acc
    }, {} as Record<string, Note[]>)
  }, [session])

  const getSessionProgress = useCallback((): number => {
    if (!session) return 0
    return calculateOverallProgress(session.phase, session.phaseProgress)
  }, [session])

  // -------------------------------------------------------------------------
  // Context Value
  // -------------------------------------------------------------------------

  const contextValue: SOPContextType = {
    // SOP Library
    sops,
    currentSOP,
    setCurrentSOP,
    addSOP,
    updateSOP,
    deleteSOP,

    // Note Management
    addNote,
    updateNote,
    deleteNote,

    // Message Management
    addMessage,

    // Session Management
    session,
    startNewSession,
    startImprovementSession,
    updateSession,
    endSession,

    // Session Notes
    addSessionNote,
    addSessionNotes,
    updateSessionNote,
    deleteSessionNote,

    // Session Messages
    addSessionMessage,

    // Phase Management
    setSessionPhase,
    advancePhase,

    // Finalization
    finalizeSession,

    // Utilities
    getSessionNotesByCategory,
    getSessionProgress,
  }

  return (
    <SOPContext.Provider value={contextValue}>
      {children}
    </SOPContext.Provider>
  )
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useSOPContext() {
  const context = useContext(SOPContext)
  if (!context) {
    throw new Error("useSOPContext must be used within a SOPProvider")
  }
  return context
}
