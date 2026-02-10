"use client"

// =============================================================================
// Stepease - SOP CONTEXT PROVIDER
// Global state management with Convex real-time persistence
// =============================================================================

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
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
  activeSessionId: Id<"sessions"> | null
  startNewSession: () => string
  resumeSession: (sessionId: string) => void
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

  // Title Management
  updateSessionTitle: (title: string) => void
}

const SOPContext = createContext<SOPContextType | undefined>(undefined)

// -----------------------------------------------------------------------------
// Provider Component
// -----------------------------------------------------------------------------

export function SOPProvider({ children }: { children: ReactNode }) {
  // Convex Queries - Real-time data from database
  const convexSops = useQuery(api.sops.list) ?? []
  const convexSessions = useQuery(api.sessions.list) ?? []

  // Convex Mutations
  const createSopMutation = useMutation(api.sops.create)
  const updateSopMutation = useMutation(api.sops.update)
  const removeSopMutation = useMutation(api.sops.remove)
  const addSopNoteMutation = useMutation(api.sops.addNote)
  const addSopMessageMutation = useMutation(api.sops.addMessage)

  const createSessionMutation = useMutation(api.sessions.create)
  const addSessionMessageMutation = useMutation(api.sessions.addMessage)
  const addSessionNotesMutation = useMutation(api.sessions.addNotes)
  const updateSessionProgressMutation = useMutation(api.sessions.updateProgress)
  const updateSessionTitleMutation = useMutation(api.sessions.updateTitle)
  const removeSessionMutation = useMutation(api.sessions.remove)

  // Usage tracking mutations
  const incrementSopCountMutation = useMutation(api.users.incrementSopCount)
  const incrementImproveCountMutation = useMutation(api.users.incrementImproveCount)

  // Local State (UI-only state)
  const [currentSOP, setCurrentSOP] = useState<SOP | null>(null)
  const [activeSessionId, setActiveSessionId] = useState<Id<"sessions"> | null>(null)
  const [localSession, setLocalSession] = useState<SessionState | null>(null)

  // Lock to prevent race condition during session creation
  const sessionCreationPromiseRef = useRef<Promise<Id<"sessions">> | null>(null)
  // Ref to track session ID synchronously (fixes closure issue with state)
  const sessionIdRef = useRef<Id<"sessions"> | null>(null)

  // Keep ref in sync with state
  sessionIdRef.current = activeSessionId

  // Transform Convex SOPs to local SOP type (add 'id' field from '_id')
  const sops: SOP[] = convexSops.map((s) => ({
    id: s._id,
    title: s.title,
    department: s.department,
    status: s.status as SOP["status"],
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
    content: s.content,
    notes: s.notes as Note[],
    chatHistory: s.chatHistory as ChatMessage[],
    sessionId: s.sessionId, // Link back to original session
  }))

  // Get current session from Convex if we have an activeSessionId
  const activeConvexSession = convexSessions.find(s => s._id === activeSessionId)
  const session: SessionState | null = activeConvexSession ? {
    id: activeConvexSession._id,
    title: activeConvexSession.title,
    messages: activeConvexSession.messages as ChatMessage[],
    notes: activeConvexSession.notes as Note[],
    phase: activeConvexSession.phase as ConversationPhase,
    phaseProgress: activeConvexSession.phaseProgress,
    questionsAsked: activeConvexSession.questionsAsked,
    createdAt: activeConvexSession.createdAt,
    metadata: activeConvexSession.metadata,
  } : localSession

  // -------------------------------------------------------------------------
  // SOP CRUD Operations
  // -------------------------------------------------------------------------

  const addSOP = useCallback(async (sop: SOP) => {
    try {
      await createSopMutation({
        title: sop.title,
        department: sop.department,
        status: sop.status,
        content: sop.content,
        sessionId: sop.sessionId, // Link back to original session
        notes: sop.notes.map(n => ({
          id: n.id,
          category: n.category,
          priority: n.priority,
          content: n.content,
          relatedTo: n.relatedTo,
          action: n.action,
          timestamp: n.timestamp,
          source: n.source,
        })),
        chatHistory: sop.chatHistory.map(m => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp,
        })),
      })
    } catch (error) {
      console.error("Failed to add SOP:", error)
    }
  }, [createSopMutation])

  const updateSOP = useCallback(async (id: string, updates: Partial<SOP>) => {
    try {
      await updateSopMutation({
        id: id as Id<"sops">,
        title: updates.title,
        department: updates.department,
        status: updates.status,
        content: updates.content,
      })
      // Update currentSOP if it's the one being modified
      if (currentSOP?.id === id) {
        setCurrentSOP((prev) => (prev ? { ...prev, ...updates } : null))
      }
    } catch (error) {
      console.error("Failed to update SOP:", error)
    }
  }, [updateSopMutation, currentSOP?.id])

  const deleteSOP = useCallback(async (id: string) => {
    try {
      await removeSopMutation({ id: id as Id<"sops"> })
      if (currentSOP?.id === id) {
        setCurrentSOP(null)
      }
    } catch (error) {
      console.error("Failed to delete SOP:", error)
    }
  }, [removeSopMutation, currentSOP?.id])

  // -------------------------------------------------------------------------
  // Note Operations (for saved SOPs)
  // -------------------------------------------------------------------------

  const addNote = useCallback(async (sopId: string, note: Note) => {
    try {
      await addSopNoteMutation({
        sopId: sopId as Id<"sops">,
        note: {
          id: note.id,
          category: note.category,
          priority: note.priority,
          content: note.content,
          relatedTo: note.relatedTo,
          action: note.action,
          timestamp: note.timestamp,
          source: note.source,
        },
      })
    } catch (error) {
      console.error("Failed to add note:", error)
    }
  }, [addSopNoteMutation])

  const updateNote = useCallback((sopId: string, noteId: string, updates: Partial<Note>) => {
    // Note: Convex doesn't have a direct updateNote mutation yet
    // This would need to be implemented in convex/sops.ts if needed
    console.warn("updateNote not yet implemented in Convex backend")
  }, [])

  const deleteNote = useCallback((sopId: string, noteId: string) => {
    // Note: Convex doesn't have a direct deleteNote mutation yet
    console.warn("deleteNote not yet implemented in Convex backend")
  }, [])

  // -------------------------------------------------------------------------
  // Message Operations (for saved SOPs)
  // -------------------------------------------------------------------------

  const addMessage = useCallback(async (sopId: string, message: ChatMessage) => {
    try {
      await addSopMessageMutation({
        sopId: sopId as Id<"sops">,
        role: message.role,
        content: message.content,
      })
    } catch (error) {
      console.error("Failed to add message:", error)
    }
  }, [addSopMessageMutation])

  // -------------------------------------------------------------------------
  // Session Management
  // -------------------------------------------------------------------------

  // -------------------------------------------------------------------------
  // Session Management
  // -------------------------------------------------------------------------

  const resumeSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId as Id<"sessions">)
    setLocalSession(null) // Ensure we use the Convex data
  }, [])

  const startNewSession = useCallback((): string => {
    const tempId = generateId("session")
    const newSession: SessionState = {
      id: tempId,
      title: "New SOP",
      messages: [],
      notes: [],
      phase: "foundation",
      phaseProgress: 0,
      questionsAsked: 0,
      createdAt: new Date().toISOString(),
    }

    // Store locally ONLY - Do not save to DB yet (Lazy Creation)
    setLocalSession(newSession)
    setActiveSessionId(null)

    return tempId
  }, [])

  const startImprovementSession = useCallback((content: string, analysis: AnalysisResult): string => {
    const tempId = generateId("session")

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

    const baseProgress = Math.min(analysis.quality.overall, 75)

    // For improvement, we DO save immediately because we have valuable analysis data
    // validation that we don't want to lose if the user refreshes.
    createSessionMutation({
      title: analysis.title || "SOP Improvement", // Use extracted title from analysis
      phase: "process",
      metadata: {
        mode: "improve",
        originalContent: content,
        analysisResult: analysis,
        initialProgress: baseProgress,
      },
    }).then((id) => {
      setActiveSessionId(id)

      // Track usage for Improve feature
      incrementImproveCountMutation().catch(console.error)

      // Add initial notes immediately
      if (improvementNotes.length > 0) {
        addSessionNotesMutation({
          sessionId: id,
          notes: improvementNotes.map(n => ({
            id: n.id,
            category: n.category,
            priority: n.priority,
            content: n.content,
            relatedTo: n.relatedTo,
            action: n.action,
            timestamp: n.timestamp,
            source: n.source,
          })),
        }).catch(console.error)
      }
    }).catch(console.error)

    return tempId
  }, [createSessionMutation, addSessionNotesMutation, incrementImproveCountMutation])

  const updateSession = useCallback((updates: Partial<SessionState>) => {
    if (activeSessionId && updates.phase !== undefined) {
      updateSessionProgressMutation({
        sessionId: activeSessionId,
        phase: updates.phase,
        phaseProgress: updates.phaseProgress,
      }).catch(console.error)
    }
    // Also update local session if exists
    setLocalSession((prev) => (prev ? { ...prev, ...updates } : null))
  }, [activeSessionId, updateSessionProgressMutation])

  const endSession = useCallback(() => {
    // We don't delete from DB here anymore, just clear local state
    setActiveSessionId(null)
    setLocalSession(null)
  }, [])

  // -------------------------------------------------------------------------
  // Session Note Operations
  // -------------------------------------------------------------------------

  const addSessionNote = useCallback((note: Note) => {
    if (activeSessionId) {
      addSessionNotesMutation({
        sessionId: activeSessionId,
        notes: [{
          id: note.id,
          category: note.category,
          priority: note.priority,
          content: note.content,
          relatedTo: note.relatedTo,
          action: note.action,
          timestamp: note.timestamp,
          source: note.source,
        }],
      }).catch(console.error)
    }
    // Also update local
    setLocalSession((prev) => prev ? { ...prev, notes: [...prev.notes, note] } : null)
  }, [activeSessionId, addSessionNotesMutation])

  const addSessionNotes = useCallback((notes: Note[]) => {
    if (notes.length === 0) return
    if (activeSessionId) {
      addSessionNotesMutation({
        sessionId: activeSessionId,
        notes: notes.map(n => ({
          id: n.id,
          category: n.category,
          priority: n.priority,
          content: n.content,
          relatedTo: n.relatedTo,
          action: n.action,
          timestamp: n.timestamp,
          source: n.source,
        })),
      }).catch(console.error)
    }
    setLocalSession((prev) => prev ? { ...prev, notes: [...prev.notes, ...notes] } : null)
  }, [activeSessionId, addSessionNotesMutation])

  // -------------------------------------------------------------------------
  // Session Message Operations
  // -------------------------------------------------------------------------

  const addSessionMessage = useCallback(async (message: ChatMessage) => {
    // Use ref for synchronous session ID check (avoids closure issues with state)
    const currentSessionId = sessionIdRef.current;

    // If we have an active session ID, just add the message
    if (currentSessionId) {
      await addSessionMessageMutation({
        sessionId: currentSessionId,
        role: message.role,
        content: message.content,
      })
    } else {
      // Lazy Create: No ID yet? Create the session NOW.
      // Use a lock to prevent race conditions (e.g., user message + AI response arriving close together)
      try {
        let sessionId: Id<"sessions">;

        // Check if a session creation is already in progress
        if (sessionCreationPromiseRef.current) {
          // Wait for the existing creation to complete
          sessionId = await sessionCreationPromiseRef.current;
        } else {
          // Start a new session creation and store the promise
          const creationPromise = createSessionMutation({
            title: "New SOP",
            phase: "foundation",
            metadata: { mode: "create" },
          });
          sessionCreationPromiseRef.current = creationPromise;

          try {
            sessionId = await creationPromise;
            // Update BOTH ref and state - ref is synchronous, state triggers re-render
            sessionIdRef.current = sessionId;
            setActiveSessionId(sessionId);

            // Track usage for SOP creation (only for the first caller)
            incrementSopCountMutation().catch(console.error);
          } finally {
            // Clear the lock after creation completes (success or failure)
            sessionCreationPromiseRef.current = null;
          }
        }

        // NOW add the message to the session
        await addSessionMessageMutation({
          sessionId: sessionId,
          role: message.role,
          content: message.content,
        });
      } catch (error) {
        console.error("Failed to lazily create session:", error);
        // Clear the lock on error
        sessionCreationPromiseRef.current = null;
      }
    }

    // Always update local state for immediate UI feedback
    setLocalSession((prev) =>
      prev
        ? {
          ...prev,
          messages: [...prev.messages, message],
          questionsAsked: message.role === "ai" ? prev.questionsAsked + 1 : prev.questionsAsked,
        }
        : null
    );
  }, [addSessionMessageMutation, createSessionMutation, incrementSopCountMutation])

  const updateSessionNote = useCallback((noteId: string, updates: Partial<Note>) => {
    // Local update only for now
    setLocalSession((prev) =>
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
    setLocalSession((prev) =>
      prev
        ? { ...prev, notes: prev.notes.filter((n) => n.id !== noteId) }
        : null
    )
  }, [])

  // -------------------------------------------------------------------------
  // Session Message Operations
  // -------------------------------------------------------------------------



  // -------------------------------------------------------------------------
  // Phase Management
  // -------------------------------------------------------------------------

  const setSessionPhase = useCallback((phase: ConversationPhase, progress?: number) => {
    if (activeSessionId) {
      updateSessionProgressMutation({
        sessionId: activeSessionId,
        phase,
        phaseProgress: progress,
      }).catch(console.error)
    }
    setLocalSession((prev) =>
      prev
        ? {
          ...prev,
          phase,
          phaseProgress: progress !== undefined ? progress : prev.phaseProgress,
        }
        : null
    )
  }, [activeSessionId, updateSessionProgressMutation])

  const advancePhase = useCallback(() => {
    const currentPhase = session?.phase
    if (!currentPhase) return

    const nextPhase = getNextPhase(currentPhase)
    if (activeSessionId) {
      updateSessionProgressMutation({
        sessionId: activeSessionId,
        phase: nextPhase,
        phaseProgress: 0,
      }).catch(console.error)
    }
    setLocalSession((prev) => {
      if (!prev) return null
      return {
        ...prev,
        phase: nextPhase,
        phaseProgress: 0,
      }
    })
  }, [session?.phase, activeSessionId, updateSessionProgressMutation])

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
    endSession()

    return newSOP
  }, [session, addSOP, endSession])

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
  // Title Management
  // -------------------------------------------------------------------------

  const updateSessionTitle = useCallback(async (title: string) => {
    if (activeSessionId) {
      try {
        await updateSessionTitleMutation({
          sessionId: activeSessionId,
          title,
        })
      } catch (error) {
        console.error("Failed to update session title:", error)
      }
    }
    // Also update local session for immediate UI feedback
    setLocalSession((prev) => prev ? { ...prev, title } : null)
  }, [activeSessionId, updateSessionTitleMutation])

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
    activeSessionId,
    startNewSession,
    resumeSession,
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

    // Title Management
    updateSessionTitle,
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
