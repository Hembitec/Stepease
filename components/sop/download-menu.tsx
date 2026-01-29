"use client"

import { useState } from "react"
import { Download, FileText, FileIcon, FileCode, Clipboard, Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  generatePDF,
  generateDOCX,
  generateHTML,
  generateMarkdown,
} from "@/lib/download-utils"

interface DownloadMenuProps {
  content: string
  title: string
}

export function DownloadMenu({ content, title }: DownloadMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async (format: string) => {
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
          await generatePDF(content, safeTitle)
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
    { id: "pdf", label: "PDF Document", icon: FileIcon },
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
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
            {error && (
              <div className="px-4 py-2 text-xs text-red-600 bg-red-50 border-b border-red-100">
                {error}
              </div>
            )}
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleDownload(option.id)}
                disabled={downloading === option.id}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <option.icon className="w-4 h-4 text-gray-500" />
                {option.label}
                {downloading === option.id && (
                  <div className="ml-auto w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                )}
              </button>
            ))}
            <hr className="my-2 border-gray-100" />
            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Clipboard className="w-4 h-4 text-gray-500" />
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
