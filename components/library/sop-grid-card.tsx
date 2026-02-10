"use client"

import Link from "next/link"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { SOP } from "@/lib/types"

interface SOPGridCardProps {
  sop: SOP
}

export function SOPGridCard({ sop }: SOPGridCardProps) {
  const statusColors = {
    draft: "bg-yellow-100 text-yellow-700",
    complete: "bg-green-100 text-green-700",
    archived: "bg-slate-100 text-slate-600",
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
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
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-slate-300 transition-all flex flex-col">
      {/* Icon */}
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
        <FileText className="w-6 h-6 text-blue-600" />
      </div>

      {/* Content */}
      <h4 className="font-semibold text-slate-900 line-clamp-2 mb-2">{sop.title}</h4>
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
        <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">{sop.department || "General"}</span>
        <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full capitalize", statusColors[sop.status])}>
          {sop.status}
        </span>
      </div>
      <p className="text-xs text-slate-400 mb-4">Updated {formatDate(sop.updatedAt)}</p>

      {/* Action */}
      <div className="mt-auto">
        <Link href={sop.status === "draft" ? `/create?id=${sop.id}` : `/preview/${sop.id}`}>
          <Button variant="outline" className="w-full bg-transparent">
            {sop.status === "draft" ? "Continue" : "View"}
          </Button>
        </Link>
      </div>
    </div>
  )
}
