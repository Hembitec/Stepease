"use client"

import { useState } from "react"
import { Check, Sparkles, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PLANS } from "@/lib/flutterwave/plans"
import { upgradeSubscription } from "@/app/actions/payment"
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs"

interface SettingsPlansPanelProps {
    currentTier: "free" | "starter" | "pro"
}

const plans = [
    {
        key: "free" as const,
        name: "Free",
        price: 0,
        description: "Try StepEase risk-free",
        features: PLANS.free.features,
        popular: false,
    },
    {
        key: "starter" as const,
        name: "Starter",
        price: 29,
        description: "For professionals getting started",
        features: PLANS.starter.features,
        popular: false,
    },
    {
        key: "pro" as const,
        name: "Pro",
        price: 79,
        description: "For teams who need more power",
        features: PLANS.pro.features,
        popular: true,
    },
]

export function SettingsPlansPanel({ currentTier }: SettingsPlansPanelProps) {
    const [loading, setLoading] = useState<string | null>(null)
    const { user } = useUser()

    const handleUpgrade = async (planKey: "starter" | "pro") => {
        try {
            setLoading(planKey)
            const email = user?.emailAddresses[0]?.emailAddress
            if (!email) {
                toast.error("Could not find your email address. Please try again.")
                setLoading(null)
                return
            }

            const checkoutUrl = await upgradeSubscription(planKey, email)
            window.location.href = checkoutUrl
        } catch (error) {
            console.error("Upgrade error:", error)
            toast.error("Failed to start upgrade. Please try again.")
            setLoading(null)
        }
    }

    return (
        <div>
            <div className="grid md:grid-cols-3 gap-5">
                {plans.map((plan) => {
                    const isCurrent = currentTier === plan.key
                    const canUpgrade =
                        plan.key !== "free" &&
                        (plan.key === "pro" || currentTier === "free")

                    return (
                        <div
                            key={plan.key}
                            className={cn(
                                "relative rounded-xl border-2 p-5 transition-all",
                                isCurrent
                                    ? "border-blue-500 bg-blue-50/40"
                                    : plan.popular
                                        ? "border-slate-300 bg-white"
                                        : "border-slate-200 bg-white"
                            )}
                        >
                            {/* Current plan badge */}
                            {isCurrent && (
                                <div className="absolute -top-3 left-4">
                                    <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                        Current Plan
                                    </span>
                                </div>
                            )}

                            {/* Popular badge */}
                            {plan.popular && !isCurrent && (
                                <div className="absolute -top-3 left-4">
                                    <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-950 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                        <Sparkles className="w-3 h-3" />
                                        Best Value
                                    </span>
                                </div>
                            )}

                            {/* Plan header */}
                            <div className="mb-4 pt-1">
                                <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                                <p className="text-sm text-slate-500 mt-0.5">{plan.description}</p>
                            </div>

                            {/* Price */}
                            <div className="mb-5">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-slate-900">${plan.price}</span>
                                    <span className="text-slate-500">/month</span>
                                </div>
                            </div>

                            {/* Features */}
                            <ul className="space-y-2.5 mb-5">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                                        <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            {isCurrent ? (
                                <Button
                                    disabled
                                    className="w-full bg-slate-100 text-slate-500 cursor-default hover:bg-slate-100"
                                >
                                    Current Plan
                                </Button>
                            ) : canUpgrade ? (
                                <Button
                                    onClick={() => handleUpgrade(plan.key as "starter" | "pro")}
                                    disabled={loading !== null}
                                    className={cn(
                                        "w-full",
                                        plan.popular
                                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                                            : "bg-slate-900 hover:bg-slate-800 text-white"
                                    )}
                                >
                                    {loading === plan.key ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        `Upgrade to ${plan.name}`
                                    )}
                                </Button>
                            ) : (
                                <Button
                                    disabled
                                    className="w-full bg-slate-100 text-slate-400 cursor-default hover:bg-slate-100"
                                >
                                    {plan.key === "free" ? "Free Plan" : "Current Plan"}
                                </Button>
                            )}
                        </div>
                    )
                })}
            </div>

            <p className="text-center text-sm text-slate-500 mt-5">
                Cancel anytime. No questions asked.
            </p>
        </div>
    )
}
