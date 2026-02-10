"use client"

import Link from "next/link"
import { MoreVertical, Download, Trash2, Archive, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { SOP } from "@/lib/types"

interface SOPTableProps {
  sops: SOP[]
  onDelete: (id: string) => void
  onArchive: (id: string) => void
  sortBy: string
  onSort: (column: string) => void
}

export function SOPTable({ sops, onDelete, onArchive, sortBy, onSort }: SOPTableProps) {
  const statusColors = {
    draft: "bg-yellow-100 text-yellow-700",
    complete: "bg-green-100 text-green-700",
    archived: "bg-slate-100 text-slate-600",
  }

  const formatDate = (dateString: string) => {
    // Use explicit locale to prevent hydration mismatch
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString))
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => onSort("title")}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-600 uppercase tracking-wider hover:text-slate-900"
                >
                  Title
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => onSort("department")}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-600 uppercase tracking-wider hover:text-slate-900"
                >
                  Dept
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => onSort("status")}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-600 uppercase tracking-wider hover:text-slate-900"
                >
                  Status
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => onSort("updatedAt")}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-600 uppercase tracking-wider hover:text-slate-900"
                >
                  Updated
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-right px-4 py-3">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sops.map((sop) => (
              <tr key={sop.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <Link
                    href={sop.status === "draft" ? `/create?id=${sop.id}` : `/preview/${sop.id}`}
                    className="font-medium text-slate-900 hover:text-blue-600"
                  >
                    {sop.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{sop.department || "General"}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn("px-2 py-0.5 text-xs font-medium rounded-full capitalize", statusColors[sop.status])}
                  >
                    {sop.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{formatDate(sop.updatedAt)}</td>
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
