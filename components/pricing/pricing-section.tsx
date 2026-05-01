"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const plans = [
    {
        name: "Free",
        monthlyPrice: 0,
        yearlyPrice: 0,
        description: "Try StepEase risk-free",
        features: [
            { text: "2 SOP creations per month", included: true },
            { text: "Markdown export only", included: true },
            { text: "Basic support", included: true },
            { text: "Improve existing SOPs", included: false },
            { text: "PDF, Word & HTML export", included: false },
        ],
        cta: "Get Started Free",
        href: "/dashboard",
        popular: false,
    },
    {
        name: "Starter",
        monthlyPrice: 29,
        yearlyPrice: 24,
        description: "For professionals getting started",
        features: [
            { text: "12 SOP creations per month", included: true },
            { text: "5 Improve workflows per month", included: true },
            { text: "All export formats", included: true },
            { text: "Clean PDF & Word Export", included: true },
            { text: "Email support", included: true },
        ],
        cta: "Start with Starter",
        href: "/dashboard?upgrade=starter",
        popular: false,
    },
    {
        name: "Pro",
        monthlyPrice: 79,
        yearlyPrice: 66,
        description: "For teams who need more power",
        features: [
            { text: "Unlimited SOP creations", included: true },
            { text: "Unlimited Improve workflows", included: true },
            { text: "Custom Brand Colors & Logos", included: true },
            { text: "Priority support", included: true },
            { text: "Version history", included: true },
        ],
        cta: "Go Pro",
        href: "/dashboard?upgrade=pro",
        popular: true,
    },
]

export function PricingSection() {
    const [isYearly, setIsYearly] = useState(false)

    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                    Simple pricing
                </h2>
                <p className="text-lg text-slate-600 max-w-xl mx-auto">
                    Start free. Upgrade when you are ready. No surprises.
                </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-3 mb-12">
                <span className={cn("text-sm", !isYearly ? "text-slate-900 font-medium" : "text-slate-500")}>
                    Monthly
                </span>
                <button
                    onClick={() => setIsYearly(!isYearly)}
                    className="relative w-14 h-7 bg-slate-200 rounded-full transition-colors"
                    aria-label="Toggle yearly billing"
                >
                    <span
                        className={cn(
                            "absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform",
                            isYearly && "translate-x-7"
                        )}
                    />
                </button>
                <span className={cn("text-sm", isYearly ? "text-slate-900 font-medium" : "text-slate-500")}>
                    Yearly
                </span>
                {isYearly && (
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium">
                        Save 17%
                    </span>
                )}
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={cn(
                            "relative rounded-2xl p-6 lg:p-8 transition-all duration-300 bg-white",
                            plan.popular
                                ? "border-2 border-blue-600 shadow-lg shadow-blue-600/10"
                                : "border border-slate-200 hover:border-slate-300"
                        )}
                    >
                        {/* Popular Badge - subtle */}
                        {plan.popular && (
                            <div className="absolute -top-3 left-6">
                                <span className="inline-flex items-center bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                                    Most popular
                                </span>
                            </div>
                        )}

                        {/* Plan Header */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-1">
                                {plan.name}
                            </h3>
                            <p className="text-sm text-slate-500">
                                {plan.description}
                            </p>
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-slate-900">
                                    ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                                </span>
                                <span className="text-slate-500">/month</span>
                            </div>
                            {isYearly && plan.monthlyPrice > 0 && (
                                <p className="text-xs text-slate-400 mt-1">
                                    Billed yearly (${plan.yearlyPrice * 12}/year)
                                </p>
                            )}
                        </div>

                        {/* Features */}
                        <ul className="space-y-3 mb-8">
                            {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    {feature.included ? (
                                        <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
                                    ) : (
                                        <X className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-300" />
                                    )}
                                    <span
                                        className={cn(
                                            "text-sm",
                                            feature.included ? "text-slate-600" : "text-slate-400"
                                        )}
                                    >
                                        {feature.text}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {/* CTA Button */}
                        <Link href={plan.href} className="block">
                            <Button
                                size="lg"
                                className={cn(
                                    "w-full h-11 text-sm font-semibold transition-all",
                                    plan.popular
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : plan.monthlyPrice === 0
                                            ? "bg-slate-100 text-slate-900 hover:bg-slate-200"
                                            : "bg-slate-900 text-white hover:bg-slate-800"
                                )}
                            >
                                {plan.cta}
                            </Button>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Enterprise Card */}
            <div className="mt-8 p-6 lg:p-8 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">Enterprise</h3>
                        <p className="text-sm text-slate-600">
                            Need SSO, custom templates, or dedicated support? We got you covered.
                        </p>
                    </div>
                    <Link href="/contact">
                        <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-white">
                            Contact sales
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Trust Signal */}
            <div className="mt-8 text-center">
                <p className="text-sm text-slate-500">
                    "Worth every penny. Saved us $15K in consulting fees." — Compliance Director, FirstLine Capital
                </p>
            </div>
        </div>
    )
}
