"use client"

import Link from "next/link"
import { FileText, MoreVertical, Download, Trash2, Archive, ArchiveRestore, Eye, Pencil, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { formatRelativeDate } from "@/lib/format-date"
import type { SOP } from "@/lib/types"

interface SOPListItemProps {
  sop: SOP
  onDelete: (id: string) => void
  onArchive: (id: string) => void
  onRevise?: (sessionId: string) => void
  isHistory?: boolean
  hasHistory?: boolean
  isHistoryExpanded?: boolean
  onToggleHistory?: () => void
}

export function SOPListItem({
  sop, onDelete, onArchive, onRevise,
  isHistory, hasHistory, isHistoryExpanded, onToggleHistory
}: SOPListItemProps) {
  const statusColors = {
    draft: "bg-yellow-100 text-yellow-700",
    complete: "bg-green-100 text-green-700",
    archived: "bg-slate-100 text-slate-600",
  }


  return (
    <div className={cn(
      "bg-white border p-4 transition-all flex items-center gap-4",
      isHistory
        ? "border-slate-100 rounded-lg bg-slate-50/50 shadow-none ml-12 hover:bg-slate-50 relative before:absolute before:left-[-24px] before:top-1/2 before:w-4 before:h-px before:bg-slate-200 after:absolute after:left-[-24px] after:top-[-100%] after:h-[150%] after:w-px after:bg-slate-200 first:after:top-[-20px] first:after:h-[calc(50%+20px)]"
        : "border-slate-200 rounded-xl hover:shadow-md hover:border-slate-300 relative z-10"
    )}>
      {/* Icon */}
      <div className={cn(
        "bg-blue-100 flex items-center justify-center flex-shrink-0",
        isHistory ? "w-8 h-8 rounded shrink-0" : "w-10 h-10 rounded-lg"
      )}>
        <FileText className={cn("text-blue-600", isHistory ? "w-4 h-4" : "w-5 h-5")} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className={cn("font-semibold text-slate-900 truncate", isHistory && "text-sm")}>{sop.title}</h4>
          {hasHistory && (
            <button
              onClick={onToggleHistory}
              className="flex justify-center items-center w-5 h-5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
              title="View version history"
            >
              <svg
                className={cn("w-3.5 h-3.5 transition-transform", isHistoryExpanded && "rotate-180")}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
          <span>{sop.department || "General"}</span>
          <span>&middot;</span>
          <span>Updated {formatRelativeDate(sop.updatedAt)}</span>
          <span>&middot;</span>
          <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full capitalize", statusColors[sop.status])}>
            {sop.status}
          </span>
          {sop.version && (
            <>
              <span>&middot;</span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                v{sop.version}
              </span>
            </>
          )}
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
            {sop.status === "draft" && !isHistory ? (
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
              {sop.status === "archived" ? (
                <><ArchiveRestore className="w-4 h-4 mr-2" />Unarchive</>
              ) : (
                <><Archive className="w-4 h-4 mr-2" />Archive</>
              )}
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
