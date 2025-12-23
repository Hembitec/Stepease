"use client"

import { Bot, User, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ChatMessage } from "@/lib/types"
import ReactMarkdown from "react-markdown"

interface MessageBubbleProps {
  message: ChatMessage
  isStreaming?: boolean
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isAI = message.role === "ai"

  return (
    <div className={cn("flex gap-3 mb-4", isAI ? "justify-start" : "justify-end")}>
      {isAI && (
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          {isStreaming ? (
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] px-4 py-3 rounded-2xl",
          isAI ? "bg-gray-100 text-gray-900 rounded-tl-sm" : "bg-blue-600 text-white rounded-tr-sm",
        )}
      >
        {isAI ? (
          <div className="text-sm leading-relaxed prose prose-sm prose-gray max-w-none">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="text-sm">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              }}
            >
              {message.content}
            </ReactMarkdown>
            {isStreaming && <span className="inline-block w-2 h-4 bg-blue-600 animate-pulse ml-0.5" />}
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        )}
      </div>
      {!isAI && (
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-gray-600" />
        </div>
      )}
    </div>
  )
}
