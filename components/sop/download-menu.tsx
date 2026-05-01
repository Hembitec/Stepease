"use client"

import { useState } from "react"
import { Download, FileText, FileIcon, FileCode, Clipboard, Check, ChevronDown, Lock, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  generatePDF,
  generateDOCX,
  generateHTML,
  generateMarkdown,
} from "@/lib/download"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

type UserTier = "free" | "starter" | "pro"

interface DownloadMenuProps {
  content: string
  title: string
  tier?: UserTier
  sopId?: string
}

export function DownloadMenu({ content, title, tier = "free", sopId }: DownloadMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showUpgradeHint, setShowUpgradeHint] = useState<string | null>(null)

  // Fetch watermark settings for Pro users
  const watermarkSettings = useQuery(api.users.getWatermarkSettings)
  const logActivity = useMutation(api.activity.log)

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
          // Starter tier gets default watermark; Pro users get custom (if enabled) or none.
          let watermarkText: string | undefined = undefined;
          if (tier === "starter") {
            watermarkText = "STEPEASE";
          } else if (tier === "pro" && watermarkSettings?.watermarkEnabled && watermarkSettings?.customWatermark) {
            watermarkText = watermarkSettings.customWatermark;
          }
          await generatePDF(content, safeTitle, watermarkText)
          break

        case "docx":
          await generateDOCX(content, safeTitle)
          break

        default:
          throw new Error(`Unknown format: ${format}`)
      }

      setIsOpen(false)
      toast.success(`${format.toUpperCase()} downloaded successfully`)

      // Log export activity
      logActivity({
        action: "exported",
        sopId: sopId,
        sopTitle: title,
        details: `Exported as ${format.toUpperCase()}`,
      }).catch(console.error)
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
  }

  const options = [
    { id: "markdown", label: "Markdown (.md)", icon: FileText },
    { id: "pdf", label: "PDF Document", icon: FileIcon },
    { id: "docx", label: "Word (.docx)", icon: FileText },
    { id: "html", label: "HTML File", icon: FileCode },
  ]

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <Download className="w-4 h-4" />
          Download
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 rounded-xl p-2">
        {error && (
          <div className="px-2 py-1.5 text-xs text-red-600 bg-red-50 rounded mb-2">
            {error}
          </div>
        )}
        {showUpgradeHint && (
          <div className="px-2 py-1.5 text-xs text-amber-700 bg-amber-50 rounded mb-2 flex items-center gap-2">
            <Crown className="w-3 h-3" />
            Upgrade to unlock {showUpgradeHint.toUpperCase()}
          </div>
        )}
        
        {options.map((option) => {
          const locked = isFormatLocked(option.id)
          return (
            <DropdownMenuItem
              key={option.id}
              onClick={(e) => {
                e.preventDefault()
                if (!locked && !downloading) handleDownload(option.id)
              }}
              disabled={locked || downloading === option.id}
              className={cn(
                "w-full flex items-center gap-3 px-2 py-2 text-sm cursor-pointer rounded-md",
                locked && "text-slate-400 focus:bg-transparent"
              )}
            >
              <option.icon className={cn("w-4 h-4", locked ? "text-slate-300" : "text-slate-500")} />
              <span className="flex-1">{option.label}</span>
              {locked && <Lock className="w-3 h-3 text-slate-400" />}
              {downloading === option.id && (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              )}
            </DropdownMenuItem>
          )
        })}
        
        <DropdownMenuSeparator className="my-1" />
        
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault()
            handleCopy()
          }}
          className="w-full flex items-center gap-3 px-2 py-2 text-sm cursor-pointer rounded-md"
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
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
