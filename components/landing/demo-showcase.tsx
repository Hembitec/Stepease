"use client"

// =============================================================================
// Demo Showcase - Main Orchestrator
// Auto-playing animated chat simulation showing the AI SOP creation flow
// Placed on the landing page, triggered by "See It In Action" button
// =============================================================================

import { useState, useEffect, useRef, useCallback } from "react"
import { Play, Pause, RotateCcw, SkipForward, Sparkles, PanelRightClose, PanelRightOpen, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DEMO_PHASES, GENERATED_SOP_PREVIEW } from "./demo-data"
import type { DemoMessage, DemoNote } from "./demo-data"
import { DemoBubble, DemoChatSkeleton, DemoTypingIndicator } from "./demo-chat"
import { DemoNotesPanel, DemoPhaseBar, DemoResult, DemoReviewBoard } from "./demo-panels"

// ---------------------------------------------------------------------------
// Constants — Timing for natural feel
// ---------------------------------------------------------------------------

const TYPING_DELAY = 800       // ms before showing typing indicator
const AI_MESSAGE_DELAY = 1800  // ms for AI "typing" before message appears
const USER_MESSAGE_DELAY = 1200 // ms pause before user message appears
const NOTE_APPEAR_DELAY = 600  // ms after AI message before notes appear
const PHASE_TRANSITION_DELAY = 1500 // ms between phases
const REVIEW_DISPLAY_DELAY = 2400 // ms showing note review before generation
const RESULT_DISPLAY_DELAY = 2000  // ms before showing generated SOP
const FIRST_AI_MESSAGE_DELAY = 600
const COMPLETE_HOLD_DELAY = 1800

// ---------------------------------------------------------------------------
// State Machine Types
// ---------------------------------------------------------------------------

type DemoState =
    | "idle"           // Waiting to start
    | "playing"        // Actively animating
    | "paused"         // User paused playback
    | "typing"         // Showing typing indicator
    | "phase-transition" // Pause between phases
    | "review"         // Showing note review before generation
    | "generating"     // Simulating SOP generation
    | "complete"       // Showing final result

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DemoShowcase() {
    const [demoState, setDemoState] = useState<DemoState>("idle")
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
    const [visibleMessages, setVisibleMessages] = useState<DemoMessage[]>([])
    const [visibleNotes, setVisibleNotes] = useState<DemoNote[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const [showResult, setShowResult] = useState(false)
    const [progress, setProgress] = useState(0)
    const [showNotesMobile, setShowNotesMobile] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const chatContainerRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const loopTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const resumeRef = useRef<(() => void) | null>(null)
    const hasAutoStartedRef = useRef(false)
    const sequenceRef = useRef(0)

    // Track if component is mounted to prevent state updates after unmount
    const isMounted = useRef(true)
    useEffect(() => {
        return () => {
            isMounted.current = false
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current)
        }
    }, [])

    // Keyboard controls: space to pause/resume
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space" && demoState !== "idle" && demoState !== "complete") {
                e.preventDefault()
                togglePause()
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [demoState, isPaused])

    // Auto-scroll chat — scoped to the chat container, NOT the page
    useEffect(() => {
        const el = chatContainerRef.current
        if (el) el.scrollTop = el.scrollHeight
    }, [visibleMessages, isTyping])

    // ---------------------------------------------------------------------------
    // Animation Engine
    // ---------------------------------------------------------------------------

    // Pause/resume mechanism
    const wait = useCallback((ms: number) => {
        return new Promise<void>((resolve) => {
            const checkPause = () => {
                if (!isMounted.current) return
                if (isPaused) {
                    resumeRef.current = () => {
                        timeoutRef.current = setTimeout(resolve, ms)
                    }
                } else {
                    timeoutRef.current = setTimeout(resolve, ms)
                }
            }
            checkPause()
        })
    }, [isPaused])

    const clearTimers = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current)
        timeoutRef.current = null
        loopTimeoutRef.current = null
    }, [])

    const togglePause = useCallback(() => {
        setIsPaused((prev) => {
            const next = !prev
            if (!next && resumeRef.current) {
                // Resuming
                resumeRef.current()
                resumeRef.current = null
            }
            return next
        })
    }, [])

    const skipToEnd = useCallback(() => {
        clearTimers()
        sequenceRef.current += 1
        // Show all phases' messages and notes
        const allMessages = DEMO_PHASES.flatMap(p => p.messages)
        const allNotes = DEMO_PHASES.flatMap(p => p.notes)
        setVisibleMessages(allMessages)
        setVisibleNotes(allNotes)
        setCurrentPhaseIndex(DEMO_PHASES.length - 1)
        setProgress(100)
        setIsTyping(false)
        setIsPaused(false)
        setDemoState("review")
        timeoutRef.current = setTimeout(() => {
            if (!isMounted.current) return
            setDemoState("generating")
            timeoutRef.current = setTimeout(() => {
                if (!isMounted.current) return
                setShowResult(true)
                setDemoState("complete")
            }, 700)
        }, 700)
    }, [clearTimers])

    const playPhaseMessages = useCallback(
        async (phaseIndex: number, sequenceId: number) => {
            const isActive = () => isMounted.current && sequenceRef.current === sequenceId
            if (!isActive()) return

            const phase = DEMO_PHASES[phaseIndex]
            if (!phase) {
                // All phases done → show note review, then generated SOP
                setDemoState("review")
                setProgress(100)
                await wait(REVIEW_DISPLAY_DELAY)
                if (!isActive()) return
                setDemoState("generating")
                await wait(RESULT_DISPLAY_DELAY)
                if (!isActive()) return
                setShowResult(true)
                setDemoState("complete")
                return
            }

            setCurrentPhaseIndex(phaseIndex)
            setProgress(phaseIndex > 0 ? DEMO_PHASES[phaseIndex - 1].progress : 0)

            // Play each message in sequence
            for (let i = 0; i < phase.messages.length; i++) {
                if (!isActive()) return

                const msg = phase.messages[i]
                const isFirstAiMessage = phaseIndex === 0 && i === 0 && msg.role === "ai"
                const delay = msg.role === "ai"
                    ? (isFirstAiMessage ? FIRST_AI_MESSAGE_DELAY : AI_MESSAGE_DELAY)
                    : USER_MESSAGE_DELAY

                // Show typing indicator for AI messages
                if (msg.role === "ai") {
                    setIsTyping(true)
                    await wait(delay)
                    if (!isActive()) return
                    setIsTyping(false)
                } else {
                    // Brief pause before user messages
                    await wait(delay)
                    if (!isActive()) return
                }

                // Add message
                setVisibleMessages((prev) => [...prev, msg])

                // Brief pause after each message
                await wait(TYPING_DELAY)
            }

            if (!isActive()) return

            // Add notes for this phase
            if (phase.notes.length > 0) {
                await wait(NOTE_APPEAR_DELAY)
                if (!isActive()) return
                setVisibleNotes((prev) => [...prev, ...phase.notes])
            }

            // Update progress
            setProgress(phase.progress)

            // Transition to next phase
            await wait(PHASE_TRANSITION_DELAY)
            if (!isActive()) return

            // Next phase
            await playPhaseMessages(phaseIndex + 1, sequenceId)
        },
        [wait]
    )

    // ---------------------------------------------------------------------------
    // Controls
    // ---------------------------------------------------------------------------

    const startDemo = useCallback(() => {
        clearTimers()
        sequenceRef.current += 1
        const sequenceId = sequenceRef.current
        setDemoState("playing")
        setVisibleMessages([])
        setVisibleNotes([])
        setCurrentPhaseIndex(0)
        setProgress(0)
        setShowResult(false)
        setIsTyping(false)
        setIsPaused(false)
        setShowNotesMobile(false)
        void playPhaseMessages(0, sequenceId)
    }, [clearTimers, playPhaseMessages])

    const restartDemo = useCallback(() => {
        clearTimers()
        setIsPaused(false)
        resumeRef.current = null
        startDemo()
    }, [clearTimers, startDemo])

    useEffect(() => {
        const element = containerRef.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAutoStartedRef.current) {
                    hasAutoStartedRef.current = true
                    startDemo()
                }
            },
            { threshold: 0.4 }
        )

        observer.observe(element)
        return () => observer.disconnect()
    }, [startDemo])

    useEffect(() => {
        if (demoState !== "complete") return

        loopTimeoutRef.current = setTimeout(() => {
            if (!isMounted.current) return
            restartDemo()
        }, COMPLETE_HOLD_DELAY)

        return () => {
            if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current)
        }
    }, [demoState, restartDemo])

    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------

    const isChatSurface =
        demoState === "playing" ||
        demoState === "typing" ||
        demoState === "phase-transition" ||
        demoState === "paused"

    const appTitle = showResult
        ? "Final SOP Preview"
        : demoState === "review" || demoState === "generating"
            ? "Review Notes"
            : "Create New SOP"

    return (
        <div ref={containerRef} className="w-full max-w-5xl mx-auto overflow-hidden">
            {/* Demo Window — Mock App UI */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
                {/* Mock Window Bar - macOS accurate colors */}
                <div className="bg-slate-800 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        {/* macOS window control colors: close #FF5F57, minimize #FFBD2E, maximize #28C840 */}
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: '#FF5F57' }} />
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: '#FFBD2E' }} />
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: '#28C840' }} />
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-400 font-medium">
                        stepease.app — {appTitle}
                    </div>
                    <div className="w-12 sm:w-16" />
                </div>

                {/* Mock App Header */}
                <div className="bg-white border-b border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between overflow-hidden">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-4 sm:w-10 sm:h-5 bg-slate-100 rounded" />
                        <span className="text-xs sm:text-sm font-semibold text-slate-800 hidden xs:inline">
                            {appTitle}
                        </span>
                    </div>
                    {demoState !== "idle" && isChatSurface && (
                        <DemoPhaseBar
                            phases={DEMO_PHASES.map((p) => ({ id: p.id, name: p.name }))}
                            currentPhaseIndex={currentPhaseIndex}
                            progress={progress}
                        />
                    )}
                    {demoState !== "idle" && !isChatSurface && (
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                            {["Interview", "Review", "Preview"].map((label, index) => {
                                const activeIndex = showResult ? 2 : 1
                                const isComplete = index < activeIndex
                                const isCurrent = index === activeIndex

                                return (
                                    <span
                                        key={label}
                                        className={cn(
                                            "rounded-full px-2.5 py-1 font-medium transition-colors",
                                            isComplete && "bg-emerald-50 text-emerald-700",
                                            isCurrent && "bg-slate-900 text-white",
                                            !isComplete && !isCurrent && "bg-slate-100 text-slate-400"
                                        )}
                                    >
                                        {label}
                                    </span>
                                )
                            })}
                        </div>
                    )}
                    {/* Mobile notes toggle */}
                    {demoState !== "idle" && !showResult && isChatSurface && (
                        <button
                            onClick={() => setShowNotesMobile(!showNotesMobile)}
                            className="lg:hidden p-1.5 text-slate-500 hover:text-slate-700"
                        >
                            {showNotesMobile ? (
                                <PanelRightClose className="w-4 h-4" />
                            ) : (
                                <PanelRightOpen className="w-4 h-4" />
                            )}
                        </button>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="relative flex h-[340px] overflow-hidden bg-[linear-gradient(180deg,rgba(248,250,252,0.8)_0%,rgba(241,245,249,0.55)_100%)] sm:h-[380px] md:h-[420px]">
                    {/* Idle State — Start Screen */}
                    {demoState === "idle" && (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center px-4">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5">
                                    <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-slate-700" />
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2">
                                    Watch the full SOP flow
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-500 mb-5 sm:mb-6 max-w-xs mx-auto">
                                    Stepease interviews the operator, extracts structured notes in real time, sends everything through review, and drafts the final SOP.
                                </p>
                                <Button
                                    onClick={startDemo}
                                    className="bg-slate-900 hover:bg-slate-800 text-white gap-2 px-5 sm:px-6 h-10 sm:h-11 text-sm"
                                >
                                    <Play className="w-4 h-4" />
                                    Start Walkthrough
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Playing State — Chat + Notes */}
                    {isChatSurface && !showResult && (
                        <>
                            {/* Chat Area */}
                            <div
                                className={cn(
                                    "flex-1 flex flex-col bg-white",
                                    showNotesMobile ? "hidden lg:flex" : "flex",
                                    "lg:border-r border-slate-200"
                                )}
                            >
                                <div className="border-b border-slate-100 px-3 py-2.5 sm:px-4">
                                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">Live walkthrough</span>
                                        <span className="rounded-full bg-slate-100 px-2.5 py-1">Employee onboarding</span>
                                        <span className="rounded-full bg-slate-100 px-2.5 py-1">Creating draft</span>
                                    </div>
                                </div>
                                <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                                    {visibleMessages.length === 0 && !isTyping && <DemoChatSkeleton />}
                                    {visibleMessages.map((msg, index) => (
                                        <DemoBubble
                                            key={`msg-${index}`}
                                            message={msg}
                                            animate
                                        />
                                    ))}

                                    {isTyping && <DemoTypingIndicator />}

                                </div>

                                {/* Fake Input Bar */}
                                <div className="border-t border-slate-200/80 bg-slate-50/80 p-2.5 sm:p-3 flex-shrink-0">
                                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm sm:px-4 sm:py-2.5">
                                        <span className="text-xs sm:text-sm text-slate-400 flex-1">
                                            Describe your process...
                                        </span>
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                                            <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 border-t-2 border-r-2 border-slate-300 -rotate-45 translate-x-[-1px]" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notes Panel — Desktop always visible, mobile toggle */}
                            <div
                                className={cn(
                                    "w-full lg:w-80 xl:w-[22rem] flex-shrink-0",
                                    showNotesMobile ? "flex" : "hidden lg:flex"
                                )}
                            >
                                <DemoNotesPanel
                                    notes={visibleNotes}
                                    totalNotes={visibleNotes.length}
                                    reviewReady={progress >= 85 || visibleNotes.length >= 8}
                                />
                            </div>
                        </>
                    )}

                    {(demoState === "review" || demoState === "generating") && !showResult && (
                        <div className="flex-1">
                            <DemoReviewBoard notes={visibleNotes} />
                        </div>
                    )}

                    {/* Complete State — Generated SOP */}
                    {showResult && (
                        <div className="flex-1 animate-in fade-in zoom-in-95 duration-700">
                            <DemoResult content={GENERATED_SOP_PREVIEW} />
                        </div>
                    )}

                    {demoState === "generating" && !showResult && (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
                            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center shadow-xl shadow-slate-200/80">
                                <div className="mx-auto mb-3 h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                                <p className="text-sm font-semibold text-slate-900">Generating your SOP</p>
                                <p className="mt-1 text-xs text-slate-500">Turning reviewed notes into a polished first draft.</p>
                            </div>
                        </div>
                    )}

                    {isPaused && demoState !== "idle" && demoState !== "complete" && (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-900/8">
                            <div className="rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-xs font-medium text-slate-700 shadow-sm backdrop-blur">
                                Paused. Press space to continue.
                            </div>
                        </div>
                    )}
                </div>

                {/* Controls Bar — Pause/Resume/Skip + Replay */}
                {demoState !== "idle" && (
                    <div className="border-t border-slate-200 bg-slate-50 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {demoState !== "complete" && (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={togglePause}
                                        className="gap-1.5 text-xs text-slate-600 hover:text-slate-900 h-7 sm:h-8"
                                    >
                                        {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                                        {isPaused ? "Resume" : "Pause"}
                                    </Button>
                                    {!showResult && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={skipToEnd}
                                            className="gap-1.5 text-xs text-slate-500 hover:text-slate-700 h-7 sm:h-8"
                                        >
                                            <SkipForward className="w-3 h-3" />
                                            Skip to end
                                        </Button>
                                    )}
                                </>
                            )}
                            {demoState === "complete" && (
                                <span className="text-[10px] sm:text-xs text-slate-500">
                                    SOP generated from structured notes, review, and final preview.
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                                <Volume2 className="h-3.5 w-3.5" />
                                Muted loop
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={restartDemo}
                                className="gap-1.5 text-xs text-slate-600 hover:text-slate-900 h-7 sm:h-8"
                            >
                                <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                Restart
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
