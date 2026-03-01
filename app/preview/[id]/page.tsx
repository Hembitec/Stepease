"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, FileText, Eye, Pencil, CheckCircle, Copy, Check, Clock, ChevronDown, History } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { MarkdownRenderer } from "@/components/sop/markdown-renderer"
import { DownloadMenu } from "@/components/sop/download-menu"
import { SharePopover } from "@/components/sop/share-popover"
import { SectionEditorModal } from "@/components/sop/section-editor-modal"
import { ActivityTimeline } from "@/components/activity/activity-timeline"
import { useSOPContext } from "@/lib/sop-context"
import { cn } from "@/lib/utils"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

type ViewMode = "markdown" | "preview"

export default function SOPPreviewPage() {
  const router = useRouter()
  const params = useParams()
  const { sops, updateSOP } = useSOPContext()

  // Convex mutation to approve (archive) session
  const approveSession = useMutation(api.sessions.approve)

  // Fetch current user for tier info
  const currentUser = useQuery(api.users.getByClerkId)
  const userTier = (currentUser?.tier as "free" | "starter" | "pro") || "free"

  // Find SOP by ID first, then by sessionId (for improvement mode where Convex generates a new ID)
  const sop = sops.find((s) => s.id === params.id)
    || sops.find((s) => s.sessionId === params.id)
    || sops[0]

  // Fetch version history
  const versionHistory = useQuery(
    api.sops.getVersionHistory,
    sop?.id ? { sopId: sop.id as any } : "skip"
  )

  const [content, setContent] = useState(sop?.content || "")
  const [viewMode, setViewMode] = useState<ViewMode>("preview")
  const [editingSection, setEditingSection] = useState<{ title: string; content: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [approving, setApproving] = useState(false)
  const [showActivity, setShowActivity] = useState(false)
  const [showVersions, setShowVersions] = useState(false)

  const hasVersions = versionHistory && versionHistory.length > 1

  // Update content when SOP loads/changes (handles async Convex data)
  useEffect(() => {
    if (sop?.content && sop.content !== content) {
      setContent(sop.content)
    }
  }, [sop?.content])

  const handleCopyMarkdown = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    toast.success("Copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleApprove = async () => {
    setApproving(true)

    // Archive the session (don't delete it, so user can revise later)
    if (sop?.sessionId) {
      try {
        await approveSession({ id: sop.sessionId as any })
      } catch (e) {
        console.error("Failed to approve session:", e)
      }
    }

    // Mark SOP as complete
    if (sop) {
      updateSOP(sop.id, { status: "complete", content })
    }

    toast.success("SOP approved & saved to Library")
    router.push("/library")
  }

  const handleSectionSave = (newContent: string) => {
    // In a real app, this would update the specific section
    setContent(content.replace(editingSection?.content || "", newContent))
    setEditingSection(null)
  }

  // Extract sections for editing
  const sections = content.split(/(?=^## )/m).filter(Boolean)

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-slate-500 hover:text-slate-900 flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline text-sm font-medium">Back</span>
        </button>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-slate-900">Your Generated SOP</h1>
          {sop?.version && (
            <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase">
              v{sop.version}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <SharePopover sopId={sop?.id || ""} existingToken={sop?.shareToken} />
          <DownloadMenu content={content} title={sop?.title || "SOP"} tier={userTier} sopId={sop?.id} />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* View Toggle */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg mb-6 w-fit">
          <button
            onClick={() => setViewMode("markdown")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
              viewMode === "markdown" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700",
            )}
          >
            <FileText className="w-3.5 h-3.5" />
            Markdown
          </button>
          <button
            onClick={() => setViewMode("preview")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
              viewMode === "preview" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700",
            )}
          >
            <Eye className="w-3.5 h-3.5" />
            Formatted Preview
          </button>
        </div>

        {/* Content */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {viewMode === "markdown" ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyMarkdown}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
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
              <div className="p-4 sm:p-6 overflow-x-auto">
                <pre className="font-mono text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">{content}</pre>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-8">
              {sections.map((section, index) => {
                const lines = section.trim().split("\n")
                const title = lines[0]?.replace(/^#+\s*/, "") || `Section ${index + 1}`

                return (
                  <div key={index} className="relative group">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSection({ title, content: section })}
                      className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-blue-600"
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

        {/* Version History Section */}
        {hasVersions && (
          <div className="mt-6 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => setShowVersions(!showVersions)}
              className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Version History</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                  {versionHistory!.length}
                </span>
              </div>
              <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", showVersions && "rotate-180")} />
            </button>
            {showVersions && (
              <div className="border-t border-slate-100 divide-y divide-slate-50">
                {versionHistory!.map((v: any) => {
                  const isCurrent = String(v._id) === sop?.id
                  return (
                    <Link
                      key={String(v._id)}
                      href={`/preview/${String(v._id)}`}
                      className={cn(
                        "flex items-center justify-between px-5 py-3 text-sm transition-colors",
                        isCurrent
                          ? "bg-blue-50/50 border-l-2 border-blue-500"
                          : "hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={cn(
                          "px-1.5 py-0.5 text-[10px] font-bold rounded uppercase",
                          isCurrent ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
                        )}>
                          v{v.version ?? 1}
                        </span>
                        <span className={cn("font-medium", isCurrent ? "text-blue-700" : "text-slate-700")}>
                          {v.title}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] text-blue-500 font-medium">Current</span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(v.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Activity Section */}
        <div className="mt-6 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <button
            onClick={() => setShowActivity(!showActivity)}
            className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Activity</span>
            </div>
            <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", showActivity && "rotate-180")} />
          </button>
          {showActivity && (
            <div className="px-5 pb-4 border-t border-slate-100 pt-3">
              <ActivityTimeline limit={15} compact />
            </div>
          )}
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
