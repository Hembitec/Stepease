"use client"

import { Crown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SubscriptionCardProps {
    tier: "free" | "starter" | "pro"
    sopsCreated?: number
    sopsLimit?: number
    improvesUsed?: number
    improvesLimit?: number
    onUpgrade?: () => void
}

const tierInfo = {
    free: {
        name: "Free",
        color: "gray",
        badge: "bg-slate-100 text-slate-700",
    },
    starter: {
        name: "Starter",
        color: "blue",
        badge: "bg-blue-100 text-blue-700",
    },
    pro: {
        name: "Pro",
        color: "indigo",
        badge: "bg-indigo-100 text-indigo-700",
    },
}

export function SubscriptionCard({ tier, sopsCreated = 0, sopsLimit = 2, improvesUsed = 0, improvesLimit = 0, onUpgrade }: SubscriptionCardProps) {
    const info = tierInfo[tier]
    const canUpgrade = tier !== "pro"
    const isUnlimited = sopsLimit === Infinity

    const formatLimit = (used: number, limit: number) => {
        if (limit === Infinity) return `${used} used (Unlimited)`
        return `${used} / ${limit}`
    }

    return (
        <div className={cn(
            "rounded-xl p-5 border",
            tier === "pro"
                ? "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200"
                : "bg-white border-slate-200"
        )}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        tier === "pro"
                            ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                            : tier === "starter"
                                ? "bg-blue-500"
                                : "bg-slate-400"
                    )}>
                        <Crown className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", info.badge)}>
                            {info.name}
                        </span>
                        <p className="text-sm text-slate-500 mt-1">
                            {isUnlimited ? "Unlimited usage" : `${sopsLimit} SOPs / ${improvesLimit} Improves per month`}
                        </p>
                    </div>
                </div>

                {canUpgrade && (
                    <Button
                        onClick={onUpgrade}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Upgrade
                    </Button>
                )}
            </div>

            {/* Usage Stats */}
            <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">SOPs Created</p>
                    <p className="text-lg font-semibold text-slate-900">{formatLimit(sopsCreated, sopsLimit)}</p>
                    {!isUnlimited && (
                        <div className="h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full transition-all"
                                style={{ width: `${Math.min((sopsCreated / sopsLimit) * 100, 100)}%` }}
                            />
                        </div>
                    )}
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Improves Used</p>
                    <p className="text-lg font-semibold text-slate-900">{formatLimit(improvesUsed, improvesLimit)}</p>
                    {!isUnlimited && improvesLimit > 0 && (
                        <div className="h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 rounded-full transition-all"
                                style={{ width: `${Math.min((improvesUsed / improvesLimit) * 100, 100)}%` }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {tier === "pro" && (
                <div className="flex items-center gap-2 text-sm text-indigo-700 mt-4">
                    <Check className="w-4 h-4" />
                    <span>All premium features unlocked</span>
                </div>
            )}
        </div>
    )
}
