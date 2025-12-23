"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, FileText, Eye, Pencil, CheckCircle, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MarkdownRenderer } from "@/components/sop/markdown-renderer"
import { DownloadMenu } from "@/components/sop/download-menu"
import { SectionEditorModal } from "@/components/sop/section-editor-modal"
import { useSOPContext } from "@/lib/sop-context"
import { cn } from "@/lib/utils"

type ViewMode = "markdown" | "preview"

export default function SOPPreviewPage() {
  const router = useRouter()
  const params = useParams()
  const { sops, updateSOP } = useSOPContext()

  const sop = sops.find((s) => s.id === params.id) || sops[0]
  const [content, setContent] = useState(sop?.content || "")
  const [viewMode, setViewMode] = useState<ViewMode>("preview")
  const [editingSection, setEditingSection] = useState<{ title: string; content: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [approving, setApproving] = useState(false)

  const handleCopyMarkdown = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleApprove = () => {
    setApproving(true)
    setTimeout(() => {
      if (sop) {
        updateSOP(sop.id, { status: "complete", content })
      }
      router.push("/library")
    }, 1000)
  }

  const handleSectionSave = (newContent: string) => {
    // In a real app, this would update the specific section
    setContent(content.replace(editingSection?.content || "", newContent))
    setEditingSection(null)
  }

  // Extract sections for editing
  const sections = content.split(/(?=^## )/m).filter(Boolean)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <Link href={`/review/${params.id}`} className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Edit Notes</span>
        </Link>
        <h1 className="text-lg font-semibold text-gray-900">Your Generated SOP</h1>
        <DownloadMenu content={content} title={sop?.title || "SOP"} />
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* View Toggle */}
        <div className="flex items-center gap-2 mb-6 bg-gray-200 rounded-lg p-1 w-fit">
          <button
            onClick={() => setViewMode("markdown")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
              viewMode === "markdown" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900",
            )}
          >
            <FileText className="w-4 h-4" />
            Markdown
          </button>
          <button
            onClick={() => setViewMode("preview")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
              viewMode === "preview" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900",
            )}
          >
            <Eye className="w-4 h-4" />
            Formatted Preview
          </button>
        </div>

        {/* Content */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {viewMode === "markdown" ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyMarkdown}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
              <div className="p-6 overflow-x-auto">
                <pre className="font-mono text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{content}</pre>
              </div>
            </div>
          ) : (
            <div className="p-8">
              {sections.map((section, index) => {
                const lines = section.trim().split("\n")
                const title = lines[0]?.replace(/^#+\s*/, "") || `Section ${index + 1}`

                return (
                  <div key={index} className="relative group">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSection({ title, content: section })}
                      className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-blue-600"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <MarkdownRenderer content={section} />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-end">
          <Button
            variant="outline"
            onClick={() => setEditingSection({ title: "Full Document", content })}
            className="gap-2 bg-transparent"
          >
            <Pencil className="w-4 h-4" />
            Ask AI to Modify
          </Button>
          <Button
            onClick={handleApprove}
            disabled={approving}
            className="bg-green-600 hover:bg-green-700 text-white gap-2"
          >
            {approving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Approving...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Approve Final SOP
              </>
            )}
          </Button>
        </div>
      </main>

      {/* Section Editor Modal */}
      {editingSection && (
        <SectionEditorModal
          sectionTitle={editingSection.title}
          content={editingSection.content}
          isOpen={true}
          onClose={() => setEditingSection(null)}
          onSave={handleSectionSave}
        />
      )}
    </div>
  )
}
