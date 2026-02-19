"use client"

import { useState } from "react"
import { Download, FileText, FileIcon, FileCode, Clipboard, Check, ChevronDown, Lock, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  generatePDF,
  generateDOCX,
  generateHTML,
  generateMarkdown,
} from "@/lib/download"

type UserTier = "free" | "starter" | "pro"

interface DownloadMenuProps {
  content: string
  title: string
  tier?: UserTier
}

export function DownloadMenu({ content, title, tier = "free" }: DownloadMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showUpgradeHint, setShowUpgradeHint] = useState<string | null>(null)

  // Define which formats are available per tier
  const tierAccess = {
    free: ["markdown"], // Only markdown
    starter: ["markdown", "pdf", "docx", "html"], // All formats (PDF watermarked)
    pro: ["markdown", "pdf", "docx", "html"], // All formats (clean)
  }

  const isFormatLocked = (format: string) => {
    return !tierAccess[tier].includes(format)
  }

  const handleDownload = async (format: string) => {
    // Check if format is locked for this tier
    if (isFormatLocked(format)) {
      setShowUpgradeHint(format)
      setTimeout(() => setShowUpgradeHint(null), 3000)
      return
    }

    setDownloading(format)
    setError(null)

    try {
      const safeTitle = title.replace(/\s+/g, "-").toLowerCase()

      switch (format) {
        case "markdown":
          generateMarkdown(content, safeTitle)
          break

        case "html":
          generateHTML(content, title)
          break

        case "pdf":
          // Add watermark for Starter tier
          const addWatermark = tier === "starter"
          await generatePDF(content, safeTitle, addWatermark)
          break

        case "docx":
          await generateDOCX(content, safeTitle)
          break

        default:
          throw new Error(`Unknown format: ${format}`)
      }

      setIsOpen(false)
    } catch (err) {
      console.error(`Download failed for ${format}:`, err)
      setError(`Failed to generate ${format.toUpperCase()}. Please try again.`)
    } finally {
      setDownloading(null)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    setIsOpen(false)
  }

  const options = [
    { id: "markdown", label: "Markdown (.md)", icon: FileText },
    { id: "pdf", label: tier === "starter" ? "PDF (watermarked)" : "PDF Document", icon: FileIcon },
    { id: "docx", label: "Word (.docx)", icon: FileText },
    { id: "html", label: "HTML File", icon: FileCode },
  ]

  return (
    <div className="relative">
      <Button onClick={() => setIsOpen(!isOpen)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
        <Download className="w-4 h-4" />
        Download
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-20">
            {error && (
              <div className="px-4 py-2 text-xs text-red-600 bg-red-50 border-b border-red-100">
                {error}
              </div>
            )}
            {showUpgradeHint && (
              <div className="px-4 py-2 text-xs text-amber-700 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
                <Crown className="w-3 h-3" />
                Upgrade to unlock {showUpgradeHint.toUpperCase()} export
              </div>
            )}
            {options.map((option) => {
              const locked = isFormatLocked(option.id)
              return (
                <button
                  key={option.id}
                  onClick={() => handleDownload(option.id)}
                  disabled={downloading === option.id}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors disabled:opacity-50",
                    locked
                      ? "text-slate-400 hover:bg-slate-50 cursor-not-allowed"
                      : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <option.icon className={cn("w-4 h-4", locked ? "text-slate-300" : "text-slate-500")} />
                  <span className="flex-1 text-left">{option.label}</span>
                  {locked && <Lock className="w-3 h-3 text-slate-400" />}
                  {downloading === option.id && (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  )}
                </button>
              )
            })}
            <hr className="my-2 border-slate-100" />
            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Clipboard className="w-4 h-4 text-slate-500" />
                  Copy to Clipboard
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
