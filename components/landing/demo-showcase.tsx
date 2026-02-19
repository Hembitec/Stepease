"use client"

// =============================================================================
// Demo Showcase - Main Orchestrator
// Auto-playing animated chat simulation showing the AI SOP creation flow
// Placed on the landing page, triggered by "See It In Action" button
// =============================================================================

import { useState, useEffect, useRef, useCallback } from "react"
import { Play, RotateCcw, Sparkles, PanelRightClose, PanelRightOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DEMO_PHASES, GENERATED_SOP_PREVIEW } from "./demo-data"
import type { DemoMessage, DemoNote } from "./demo-data"
import { DemoBubble, DemoTypingIndicator } from "./demo-chat"
import { DemoNotesPanel, DemoPhaseBar, DemoResult } from "./demo-panels"

// ---------------------------------------------------------------------------
// Constants — Timing for natural feel
// ---------------------------------------------------------------------------

const TYPING_DELAY = 800       // ms before showing typing indicator
const AI_MESSAGE_DELAY = 1800  // ms for AI "typing" before message appears
const USER_MESSAGE_DELAY = 1200 // ms pause before user message appears
const NOTE_APPEAR_DELAY = 600  // ms after AI message before notes appear
const PHASE_TRANSITION_DELAY = 1500 // ms between phases
const RESULT_DISPLAY_DELAY = 2000  // ms before showing generated SOP

// ---------------------------------------------------------------------------
// State Machine Types
// ---------------------------------------------------------------------------

type DemoState =
    | "idle"           // Waiting to start
    | "playing"        // Actively animating
    | "typing"         // Showing typing indicator
    | "phase-transition" // Pause between phases
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
    const chatContainerRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Track if component is mounted to prevent state updates after unmount
    const isMounted = useRef(true)
    useEffect(() => {
        return () => {
            isMounted.current = false
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    // Auto-scroll chat — scoped to the chat container, NOT the page
    useEffect(() => {
        const el = chatContainerRef.current
        if (el) el.scrollTop = el.scrollHeight
    }, [visibleMessages, isTyping])

    // ---------------------------------------------------------------------------
    // Animation Engine
    // ---------------------------------------------------------------------------

    const playPhaseMessages = useCallback(
        async (phaseIndex: number) => {
            if (!isMounted.current) return

            const phase = DEMO_PHASES[phaseIndex]
            if (!phase) {
                // All phases done → show generated SOP
                setDemoState("generating")
                setProgress(100)
                timeoutRef.current = setTimeout(() => {
                    if (!isMounted.current) return
                    setShowResult(true)
                    setDemoState("complete")
                }, RESULT_DISPLAY_DELAY)
                return
            }

            setCurrentPhaseIndex(phaseIndex)
            setProgress(phaseIndex > 0 ? DEMO_PHASES[phaseIndex - 1].progress : 0)

            // Play each message in sequence
            for (let i = 0; i < phase.messages.length; i++) {
                if (!isMounted.current) return

                const msg = phase.messages[i]
                const delay = msg.role === "ai" ? AI_MESSAGE_DELAY : USER_MESSAGE_DELAY

                // Show typing indicator for AI messages
                if (msg.role === "ai") {
                    setIsTyping(true)
                    await new Promise((resolve) => {
                        timeoutRef.current = setTimeout(resolve, delay)
                    })
                    if (!isMounted.current) return
                    setIsTyping(false)
                } else {
                    // Brief pause before user messages
                    await new Promise((resolve) => {
                        timeoutRef.current = setTimeout(resolve, delay)
                    })
                    if (!isMounted.current) return
                }

                // Add message
                setVisibleMessages((prev) => [...prev, msg])

                // Brief pause after each message
                await new Promise((resolve) => {
                    timeoutRef.current = setTimeout(resolve, TYPING_DELAY)
                })
            }

            if (!isMounted.current) return

            // Add notes for this phase
            if (phase.notes.length > 0) {
                await new Promise((resolve) => {
                    timeoutRef.current = setTimeout(resolve, NOTE_APPEAR_DELAY)
                })
                if (!isMounted.current) return
                setVisibleNotes((prev) => [...prev, ...phase.notes])
            }

            // Update progress
            setProgress(phase.progress)

            // Transition to next phase
            await new Promise((resolve) => {
                timeoutRef.current = setTimeout(resolve, PHASE_TRANSITION_DELAY)
            })
            if (!isMounted.current) return

            // Next phase
            playPhaseMessages(phaseIndex + 1)
        },
        []
    )

    // ---------------------------------------------------------------------------
    // Controls
    // ---------------------------------------------------------------------------

    const startDemo = useCallback(() => {
        setDemoState("playing")
        setVisibleMessages([])
        setVisibleNotes([])
        setCurrentPhaseIndex(0)
        setProgress(0)
        setShowResult(false)
        setIsTyping(false)
        playPhaseMessages(0)
    }, [playPhaseMessages])

    const restartDemo = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        startDemo()
    }, [startDemo])

    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------

    return (
        <div ref={containerRef} className="w-full max-w-5xl mx-auto overflow-hidden">
            {/* Demo Window — Mock App UI */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
                {/* Mock Window Bar */}
                <div className="bg-slate-800 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500" />
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-400 font-medium">
                        stepease.app — Create New SOP
                    </div>
                    <div className="w-12 sm:w-16" />
                </div>

                {/* Mock App Header */}
                <div className="bg-white border-b border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between overflow-hidden">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-4 sm:w-10 sm:h-5 bg-slate-100 rounded" />
                        <span className="text-xs sm:text-sm font-semibold text-slate-800 hidden xs:inline">
                            Creating New SOP
                        </span>
                    </div>
                    {demoState !== "idle" && (
                        <DemoPhaseBar
                            phases={DEMO_PHASES.map((p) => ({ id: p.id, name: p.name }))}
                            currentPhaseIndex={currentPhaseIndex}
                            progress={progress}
                        />
                    )}
                    {/* Mobile notes toggle */}
                    {demoState !== "idle" && !showResult && (
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
                <div className="h-[340px] sm:h-[380px] md:h-[420px] flex overflow-hidden">
                    {/* Idle State — Start Screen */}
                    {demoState === "idle" && (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center px-4">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5">
                                    <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2">
                                    Watch AI Create an SOP
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-500 mb-5 sm:mb-6 max-w-xs mx-auto">
                                    See how our AI interviews you and generates a professional SOP
                                    in minutes — not weeks.
                                </p>
                                <Button
                                    onClick={startDemo}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white gap-2 px-5 sm:px-6 h-10 sm:h-11 text-sm shadow-lg shadow-blue-600/25"
                                >
                                    <Play className="w-4 h-4" />
                                    Play Demo
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Playing State — Chat + Notes */}
                    {demoState !== "idle" && !showResult && (
                        <>
                            {/* Chat Area */}
                            <div
                                className={cn(
                                    "flex-1 flex flex-col bg-white",
                                    showNotesMobile ? "hidden lg:flex" : "flex",
                                    "lg:border-r border-slate-200"
                                )}
                            >
                                <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                                    {visibleMessages.map((msg, index) => (
                                        <DemoBubble
                                            key={`msg-${index}`}
                                            message={msg}
                                            animate
                                        />
                                    ))}

                                    {isTyping && <DemoTypingIndicator />}

                                    {demoState === "generating" && (
                                        <div className="flex items-center gap-2 text-sm text-blue-600 py-3 justify-center">
                                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                            <span className="text-xs sm:text-sm font-medium">
                                                Generating your SOP...
                                            </span>
                                        </div>
                                    )}


                                </div>

                                {/* Fake Input Bar */}
                                <div className="border-t border-slate-200/80 bg-slate-50/80 p-2.5 sm:p-3 flex-shrink-0">
                                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5">
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
                                />
                            </div>
                        </>
                    )}

                    {/* Complete State — Generated SOP */}
                    {showResult && (
                        <div className="flex-1 animate-in fade-in zoom-in-95 duration-700">
                            <DemoResult content={GENERATED_SOP_PREVIEW} />
                        </div>
                    )}
                </div>

                {/* Bottom Bar — Replay */}
                {demoState === "complete" && (
                    <div className="border-t border-slate-200 bg-slate-50 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between">
                        <span className="text-[10px] sm:text-xs text-slate-500">
                            ✨ SOP generated from a 5-minute conversation
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={restartDemo}
                            className="gap-1.5 text-xs text-slate-600 hover:text-slate-900 h-7 sm:h-8"
                        >
                            <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            Replay
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
