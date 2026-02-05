"use client"

import { useState } from "react"
import { X, Crown, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PLANS } from "@/lib/flutterwave/plans"

interface UpgradeModalProps {
    isOpen: boolean
    onClose: () => void
    currentTier?: "free" | "starter" | "pro"
    triggerReason?: "create_limit" | "improve_limit" | "manual"
}

export function UpgradeModal({ isOpen, onClose, currentTier = "free" }: UpgradeModalProps) {
    const [loading, setLoading] = useState<string | null>(null)

    if (!isOpen) return null

    const handleUpgrade = async (planKey: "starter" | "pro") => {
        setLoading(planKey)
        // In production, this would redirect to Flutterwave checkout
        const plan = PLANS[planKey]
        console.log(`Upgrading to ${plan.name} at $${plan.price}/month`)

        // Simulate redirect delay
        setTimeout(() => {
            // window.location.href = `/api/checkout?plan=${planKey}`
            setLoading(null)
            alert(`Upgrade to ${plan.name} coming soon!`)
        }, 1000)
    }

    const plans = [
        {
            key: "starter" as const,
            name: "Starter",
            price: 29,
            features: PLANS.starter.features,
            popular: false,
        },
        {
            key: "pro" as const,
            name: "Pro",
            price: 79,
            features: PLANS.pro.features,
            popular: true,
        },
    ]

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <Crown className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Upgrade Your Plan</h2>
                            <p className="text-sm text-gray-500">Unlock more features and power</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Plans Grid */}
                <div className="p-6 grid md:grid-cols-2 gap-6">
                    {plans.map((plan) => {
                        const isCurrentPlan = currentTier === plan.key
                        const canUpgrade = plan.key === "pro" || currentTier === "free"

                        return (
                            <div
                                key={plan.key}
                                className={cn(
                                    "relative rounded-xl p-6 border-2 transition-all",
                                    plan.popular
                                        ? "border-blue-500 bg-blue-50/50"
                                        : "border-gray-200 hover:border-gray-300"
                                )}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                            <Sparkles className="w-3 h-3" />
                                            Best Value
                                        </span>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1 mt-2">
                                        <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                                        <span className="text-gray-500">/month</span>
                                    </div>
                                </div>

                                <ul className="space-y-3 mb-6">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                            <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    onClick={() => handleUpgrade(plan.key)}
                                    disabled={isCurrentPlan || !canUpgrade || loading !== null}
                                    className={cn(
                                        "w-full",
                                        plan.popular
                                            ? "bg-blue-600 hover:bg-blue-700"
                                            : "bg-gray-900 hover:bg-gray-800"
                                    )}
                                >
                                    {loading === plan.key ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : isCurrentPlan ? (
                                        "Current Plan"
                                    ) : (
                                        `Upgrade to ${plan.name}`
                                    )}
                                </Button>
                            </div>
                        )
                    })}
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 text-center text-sm text-gray-500">
                    Cancel anytime. No questions asked.
                </div>
            </div>
        </div>
    )
}
