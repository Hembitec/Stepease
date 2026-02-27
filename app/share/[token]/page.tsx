"use client"

import { useParams } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { FileText, Calendar, Building, ExternalLink } from "lucide-react"
import { MarkdownRenderer } from "@/components/sop/markdown-renderer"

export default function SharedSOPPage() {
    const params = useParams()
    const token = params.token as string

    const sop = useQuery(api.sops.getByShareToken, { token })

    // Loading
    if (sop === undefined) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-pulse text-slate-400 text-sm">Loading shared SOP…</div>
            </div>
        )
    }

    // Not found
    if (sop === null) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center max-w-sm">
                    <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-7 h-7 text-slate-400" />
                    </div>
                    <h1 className="text-lg font-semibold text-slate-900 mb-1">SOP Not Found</h1>
                    <p className="text-sm text-slate-500">
                        This shared link may have been revoked or the SOP no longer exists.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top bar */}
            <header className="bg-white border-b border-slate-200 px-4 py-3">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-sm font-semibold text-slate-900">{sop.title}</h1>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                {sop.department && (
                                    <>
                                        <Building className="w-3 h-3" />
                                        <span>{sop.department}</span>
                                        <span>·</span>
                                    </>
                                )}
                                <Calendar className="w-3 h-3" />
                                <span>Updated {new Date(sop.updatedAt).toLocaleDateString()}</span>
                                {sop.version && sop.version > 1 && (
                                    <>
                                        <span>·</span>
                                        <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-semibold uppercase">
                                            v{sop.version}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener"
                        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors"
                    >
                        <span className="font-medium">Built with StepEase</span>
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                <article className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-sm">
                    <MarkdownRenderer content={sop.content} />
                </article>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-100 py-6 text-center">
                <p className="text-xs text-slate-400">
                    This SOP was shared as a read-only document via{" "}
                    <a href="/" className="text-blue-500 hover:text-blue-600 font-medium">StepEase</a>
                </p>
            </footer>
        </div>
    )
}
