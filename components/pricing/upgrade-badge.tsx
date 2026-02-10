"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface UpgradeBadgeProps {
    isCollapsed: boolean
    isMobileOpen?: boolean
}

export function UpgradeBadge({ isCollapsed, isMobileOpen }: UpgradeBadgeProps) {
    const showFull = !isCollapsed || isMobileOpen

    return (
        <div
            className={cn(
                "transition-all duration-200",
                isCollapsed && !isMobileOpen ? "px-0 flex justify-center" : "px-3"
            )}
        >
            <Link
                href="/settings?tab=billing"
                className={cn(
                    "flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
                    showFull
                        ? "w-full px-4 py-2.5 rounded-xl gap-2 justify-center"
                        : "w-9 h-9 rounded-lg justify-center"
                )}
                title={!showFull ? "Upgrade to Pro" : undefined}
            >
                <Sparkles
                    className={cn(
                        "flex-shrink-0",
                        showFull ? "w-4 h-4" : "w-5 h-5"
                    )}
                />
                {showFull && <span className="text-sm">Upgrade to Pro</span>}
            </Link>
        </div>
    )
}
