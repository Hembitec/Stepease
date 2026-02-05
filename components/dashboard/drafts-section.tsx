"use client"

import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Clock, ArrowRight, Sparkles, Upload, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { calculateOverallProgress, type ConversationPhase } from "@/lib/types"
import { DraftsSkeleton } from "@/components/skeletons"

export function DraftsSection() {
    const sessionsResult = useQuery(api.sessions.list)

    // Show skeleton while loading
    if (sessionsResult === undefined) {
        return <DraftsSkeleton />
    }

    const sessions = sessionsResult ?? []

    if (sessions.length === 0) {
        return null
    }

    // Show max 2 items on dashboard
    const displaySessions = sessions.slice(0, 2)

    return (
        <div className="mb-8 lg:mb-10">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-500" />
                    <h2 className="text-lg font-bold text-slate-900">Continue Where You Left Off</h2>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                        {sessions.length}
                    </span>
                </div>
                {sessions.length > 2 && (
                    <Link
                        href="/library?tab=in-progress"
                        className="text-blue-600 hover:text-blue-700 text-sm font-semibold inline-flex items-center gap-1"
                    >
                        View all
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                )}
            </div>

            {/* List style layout */}
            <div className="space-y-3">
                {displaySessions.map((session) => {
                    // Use phaseProgress directly (not overall progress)
                    const progress = session.phaseProgress
                    const isImprove = session.metadata?.mode === "improve"

                    return (
                        <Link
                            key={session._id}
                            href={isImprove ? `/improve?session=${session._id}` : `/create?session=${session._id}`}
                            className="group block"
                        >
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200/80 shadow-lg hover:shadow-xl hover:border-amber-200 transition-all duration-300 flex items-center gap-4">
                                {/* Icon */}
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 ${isImprove
                                    ? "bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-emerald-500/25"
                                    : "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/25"
                                    }`}>
                                    {isImprove ? (
                                        <Upload className="w-6 h-6 text-white" />
                                    ) : (
                                        <Sparkles className="w-6 h-6 text-white" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                                            {session.title}
                                        </h3>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${isImprove
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-blue-100 text-blue-700"
                                            }`}>
                                            {isImprove ? "Improving" : "Creating"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 capitalize">Phase: {session.phase}</p>
                                </div>

                                {/* Progress */}
                                <div className="w-32 flex-shrink-0 hidden sm:block">
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="text-slate-500">Progress</span>
                                        <span className="font-semibold text-slate-700">{Math.round(progress)}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${isImprove
                                                ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                                                : "bg-gradient-to-r from-blue-500 to-blue-600"
                                                }`}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Continue Button */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 flex-shrink-0"
                                >
                                    <Play className="w-4 h-4 mr-1" />
                                    <span className="hidden sm:inline">Continue</span>
                                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
