"use client"

import Link from "next/link"
import { FileText, MoreVertical, Download, Trash2, Archive, Eye, Pencil, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { SOP } from "@/lib/types"

interface SOPListItemProps {
  sop: SOP
  onDelete: (id: string) => void
  onArchive: (id: string) => void
  onRevise?: (sessionId: string) => void
}

export function SOPListItem({ sop, onDelete, onArchive, onRevise }: SOPListItemProps) {
  const statusColors = {
    draft: "bg-yellow-100 text-yellow-700",
    complete: "bg-green-100 text-green-700",
    archived: "bg-gray-100 text-gray-600",
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffHours < 1) return "Just now"
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays}d ago`
    // Use explicit locale to prevent hydration mismatch
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }


  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition-all flex items-center gap-4">
      {/* Icon */}
      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <FileText className="w-5 h-5 text-blue-600" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 truncate">{sop.title}</h4>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
          <span>{sop.department || "General"}</span>
          <span>&middot;</span>
          <span>Updated {formatDate(sop.updatedAt)}</span>
          <span>&middot;</span>
          <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full capitalize", statusColors[sop.status])}>
            {sop.status}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link href={
          sop.status === "draft"
            ? (sop.sessionId ? `/create?session=${sop.sessionId}` : `/create?id=${sop.id}`)
            : `/preview/${sop.id}`
        }>
          <Button variant="outline" size="sm" className="gap-1.5 bg-transparent">
            {sop.status === "draft" ? (
              <>
                <Pencil className="w-4 h-4" />
                Continue
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                View
              </>
            )}
          </Button>
        </Link>
        <Button variant="outline" size="sm" className="gap-1.5 bg-transparent">
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Download</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {sop.sessionId && sop.status === "complete" && onRevise && (
              <DropdownMenuItem onClick={() => onRevise(sop.sessionId!)}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Revise
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onArchive(sop.id)}>
              <Archive className="w-4 h-4 mr-2" />
              Archive
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={() => onDelete(sop.id)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
