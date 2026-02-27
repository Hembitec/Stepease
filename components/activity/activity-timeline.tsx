"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { formatRelativeDate } from "@/lib/format-date"
import {
    FileText, CheckCircle, RefreshCw, Download,
    Share2, Archive, Trash2, Sparkles, Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"

const ACTION_CONFIG: Record<string, {
    icon: React.ComponentType<{ className?: string }>
    color: string
    label: string
}> = {
    created: { icon: Sparkles, color: "text-blue-600 bg-blue-50", label: "Created" },
    approved: { icon: CheckCircle, color: "text-green-600 bg-green-50", label: "Approved" },
    revised: { icon: RefreshCw, color: "text-violet-600 bg-violet-50", label: "Revised" },
    exported: { icon: Download, color: "text-cyan-600 bg-cyan-50", label: "Exported" },
    shared: { icon: Share2, color: "text-indigo-600 bg-indigo-50", label: "Shared" },
    archived: { icon: Archive, color: "text-amber-600 bg-amber-50", label: "Archived" },
    deleted: { icon: Trash2, color: "text-red-600 bg-red-50", label: "Deleted" },
}

interface ActivityTimelineProps {
    limit?: number
    compact?: boolean
}

export function ActivityTimeline({ limit = 20, compact = false }: ActivityTimelineProps) {
    const entries = useQuery(api.activity.list, { limit })

    if (entries === undefined) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3 animate-pulse">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex-shrink-0" />
                        <div className="flex-1 space-y-1.5">
                            <div className="h-3 bg-slate-100 rounded w-2/3" />
                            <div className="h-2.5 bg-slate-50 rounded w-1/3" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (!entries || entries.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2.5">
                    <Clock className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500">No activity yet</p>
                <p className="text-xs text-slate-400 mt-0.5">Your SOP actions will appear here</p>
            </div>
        )
    }

    return (
        <div className="space-y-1">
            {entries.map((entry, index) => {
                const config = ACTION_CONFIG[entry.action] || ACTION_CONFIG.created
                const Icon = config.icon
                const isLast = index === entries.length - 1

                return (
                    <div key={entry._id} className="flex items-start gap-3 group relative">
                        {/* Timeline connector */}
                        {!isLast && !compact && (
                            <div className="absolute left-4 top-9 w-px h-[calc(100%-4px)] bg-slate-100" />
                        )}

                        {/* Icon */}
                        <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 z-10",
                            config.color
                        )}>
                            <Icon className="w-4 h-4" />
                        </div>

                        {/* Content */}
                        <div className={cn("flex-1 min-w-0", compact ? "py-1" : "py-1.5")}>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-slate-700">{config.label}</span>
                                {entry.sopTitle && (
                                    <>
                                        <span className="text-xs text-slate-400">·</span>
                                        <span className="text-xs text-slate-600 truncate font-medium">{entry.sopTitle}</span>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                                {entry.details && (
                                    <span className="text-[11px] text-slate-400">{entry.details}</span>
                                )}
                                <span className="text-[11px] text-slate-300">
                                    {formatRelativeDate(entry.timestamp)}
                                </span>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
