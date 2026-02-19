"use client"

// =============================================================================
// Demo Showcase - Chat Simulation Component
// Renders the animated chat bubbles with typing indicator
// =============================================================================

import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DemoMessage } from "./demo-data"

// -----------------------------------------------------------------------------
// Typing Indicator
// -----------------------------------------------------------------------------

export function DemoTypingIndicator() {
    return (
        <div className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                    <span
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                    />
                    <span
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                    />
                    <span
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                    />
                </div>
            </div>
        </div>
    )
}

// -----------------------------------------------------------------------------
// Message Bubble
// -----------------------------------------------------------------------------

interface DemoBubbleProps {
    message: DemoMessage
    animate?: boolean
}

export function DemoBubble({ message, animate = false }: DemoBubbleProps) {
    const isAI = message.role === "ai"

    return (
        <div
            className={cn(
                "flex gap-2.5 transition-all duration-500",
                isAI ? "justify-start" : "justify-end",
                animate ? "opacity-100 translate-y-0" : ""
            )}
        >
            {isAI && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
            )}
            <div
                className={cn(
                    "max-w-[85%] px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl",
                    isAI
                        ? "bg-slate-100 text-slate-800 rounded-tl-sm"
                        : "bg-blue-600 text-white rounded-tr-sm"
                )}
            >
                <p className="text-xs sm:text-sm leading-relaxed">{message.content}</p>
            </div>
            {!isAI && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
                </div>
            )}
        </div>
    )
}
