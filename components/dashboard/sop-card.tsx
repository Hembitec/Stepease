"use client"

import Link from "next/link"
import { FileText, MoreVertical, Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { SOP } from "@/lib/types"

interface SOPCardProps {
  sop: SOP
  onDelete?: (id: string) => void
}

export function SOPCard({ sop, onDelete }: SOPCardProps) {
  const statusColors = {
    draft: "bg-yellow-100 text-yellow-700",
    complete: "bg-green-100 text-green-700",
    archived: "bg-slate-100 text-slate-600",
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffHours < 1) return "Just now"
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays === 1) return "Yesterday"
    return `${diffDays} days ago`
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-slate-300 transition-all">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 truncate">{sop.title}</h4>
          <p className="text-sm text-slate-500">
            {sop.department} &middot; {formatDate(sop.updatedAt)}
          </p>
          <span
            className={cn(
              "inline-block mt-2 px-2 py-0.5 text-xs font-medium rounded-full capitalize",
              statusColors[sop.status],
            )}
          >
            {sop.status}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/preview/${sop.id}`}>View</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="w-4 h-4 mr-2" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={() => onDelete?.(sop.id)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex gap-2 mt-4">
        <Link href={sop.status === "draft" ? `/create?id=${sop.id}` : `/preview/${sop.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            {sop.status === "draft" ? "Continue" : "Open"}
          </Button>
        </Link>
      </div>
    </div>
  )
}
