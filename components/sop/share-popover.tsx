"use client"

import { useState, useCallback } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Share2, Copy, Check, LinkIcon, Unlink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface SharePopoverProps {
    sopId: string
    existingToken?: string
}

export function SharePopover({ sopId, existingToken }: SharePopoverProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [token, setToken] = useState(existingToken || "")
    const [copied, setCopied] = useState(false)
    const [generating, setGenerating] = useState(false)

    const generateToken = useMutation(api.sops.generateShareToken)
    const revokeToken = useMutation(api.sops.revokeShareToken)

    const shareUrl = token
        ? `${typeof window !== "undefined" ? window.location.origin : ""}/share/${token}`
        : ""

    const handleGenerate = useCallback(async () => {
        setGenerating(true)
        try {
            const newToken = await generateToken({ id: sopId as Id<"sops"> })
            setToken(newToken)
            toast.success("Share link generated")
        } catch (e) {
            toast.error("Failed to generate share link")
        } finally {
            setGenerating(false)
        }
    }, [generateToken, sopId])

    const handleRevoke = useCallback(async () => {
        try {
            await revokeToken({ id: sopId as Id<"sops"> })
            setToken("")
            toast.success("Share link revoked")
        } catch (e) {
            toast.error("Failed to revoke share link")
        }
    }, [revokeToken, sopId])

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        toast.success("Link copied to clipboard")
        setTimeout(() => setCopied(false), 2000)
    }, [shareUrl])

    return (
        <div className="relative">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className={cn("gap-1.5", token && "border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100")}
            >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">{token ? "Shared" : "Share"}</span>
            </Button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

                    {/* Popover */}
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-lg z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        <h3 className="text-sm font-semibold text-slate-900 mb-1">Share SOP</h3>
                        <p className="text-xs text-slate-500 mb-4">
                            Anyone with the link can view this SOP (read-only).
                        </p>

                        {token ? (
                            <div className="space-y-3">
                                {/* Share URL display */}
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 truncate font-mono">
                                        {shareUrl}
                                    </div>
                                    <button
                                        onClick={handleCopy}
                                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                    >
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>

                                {/* Active indicator & revoke */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-xs text-slate-500">Link is active</span>
                                    </div>
                                    <button
                                        onClick={handleRevoke}
                                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors"
                                    >
                                        <Unlink className="w-3 h-3" />
                                        Revoke
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Button
                                onClick={handleGenerate}
                                disabled={generating}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm gap-2"
                            >
                                <LinkIcon className="w-4 h-4" />
                                {generating ? "Generating…" : "Generate Share Link"}
                            </Button>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
