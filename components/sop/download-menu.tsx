"use client"

import { useState } from "react"
import { Download, FileText, FileIcon, FileCode, Clipboard, Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DownloadMenuProps {
  content: string
  title: string
}

export function DownloadMenu({ content, title }: DownloadMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState<string | null>(null)

  const handleDownload = (format: string) => {
    setDownloading(format)

    setTimeout(() => {
      // Simulate download
      const blob = new Blob([content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.${format === "markdown" ? "md" : format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setDownloading(null)
      setIsOpen(false)
    }, 500)
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
