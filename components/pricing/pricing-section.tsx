"use client"

import Link from "next/link"
import { Check, Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const plans = [
    {
        name: "Free",
        price: 0,
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
        price: 29,
        description: "For professionals getting started",
        features: [
            { text: "12 SOP creations per month", included: true },
            { text: "5 Improve workflows per month", included: true },
            { text: "All export formats", included: true },
            { text: "PDF with StepEase branding", included: true },
            { text: "Email support", included: true },
        ],
        cta: "Start with Starter",
        href: "/dashboard?upgrade=starter",
        popular: false,
    },
    {
        name: "Pro",
        price: 79,
        description: "For teams who need more power",
        features: [
            { text: "Unlimited SOP creations", included: true },
            { text: "Unlimited Improve workflows", included: true },
            { text: "All export formats (clean PDF)", included: true },
            { text: "Priority support", included: true },
            { text: "Version history", included: true },
        ],
        cta: "Go Pro",
        href: "/dashboard?upgrade=pro",
        popular: true,
    },
]

export function PricingSection() {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <p className="text-blue-600 font-semibold mb-4 tracking-wide uppercase text-sm">
                    Simple Pricing
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                    Start free, upgrade when ready
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    No hidden fees. No surprises. Cancel anytime.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={cn(
                            "relative rounded-2xl p-8 transition-all duration-300",
                            plan.popular
                                ? "bg-gradient-to-b from-blue-600 to-indigo-700 text-white shadow-2xl shadow-blue-600/25 scale-[1.02]"
                                : "bg-white border-2 border-slate-200 hover:border-slate-300 hover:shadow-lg"
                        )}
                    >
                        {/* Popular Badge */}
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <span className="inline-flex items-center gap-1.5 bg-amber-400 text-amber-950 text-sm font-semibold px-4 py-1.5 rounded-full shadow-lg">
                                    <Sparkles className="w-4 h-4" />
                                    Most Popular
                                </span>
                            </div>
                        )}

                        {/* Plan Header */}
                        <div className="mb-6">
                            <h3
                                className={cn(
                                    "text-xl font-bold mb-2",
                                    plan.popular ? "text-white" : "text-slate-900"
                                )}
                            >
                                {plan.name}
                            </h3>
                            <p
                                className={cn(
                                    "text-sm",
                                    plan.popular ? "text-blue-100" : "text-slate-600"
                                )}
                            >
                                {plan.description}
                            </p>
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                            <div className="flex items-baseline gap-1">
                                <span
                                    className={cn(
                                        "text-4xl font-bold",
                                        plan.popular ? "text-white" : "text-slate-900"
                                    )}
                                >
                                    ${plan.price}
                                </span>
                                <span
                                    className={cn(
                                        "text-lg",
                                        plan.popular ? "text-blue-200" : "text-slate-500"
                                    )}
                                >
                                    /month
                                </span>
                            </div>
                            {plan.price > 0 && (
                                <p
                                    className={cn(
                                        "text-sm mt-2",
                                        plan.popular ? "text-blue-200" : "text-slate-500"
                                    )}
                                >
                                    Save 17% with yearly billing
                                </p>
                            )}
                        </div>

                        {/* Features */}
                        <ul className="space-y-3 mb-8">
                            {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    {feature.included ? (
                                        <Check
                                            className={cn(
                                                "w-5 h-5 flex-shrink-0 mt-0.5",
                                                plan.popular ? "text-blue-200" : "text-blue-600"
                                            )}
                                        />
                                    ) : (
                                        <X
                                            className={cn(
                                                "w-5 h-5 flex-shrink-0 mt-0.5",
                                                plan.popular ? "text-blue-300/50" : "text-slate-300"
                                            )}
                                        />
                                    )}
                                    <span
                                        className={cn(
                                            "text-sm",
                                            feature.included
                                                ? plan.popular ? "text-blue-50" : "text-slate-600"
                                                : plan.popular ? "text-blue-300/50" : "text-slate-400"
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
                                    "w-full h-12 text-base font-semibold transition-all",
                                    plan.popular
                                        ? "bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
                                        : plan.price === 0
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

            {/* Enterprise Teaser */}
            <div className="mt-12 text-center">
                <p className="text-slate-500">
                    Need team features or custom solutions?{" "}
                    <Link href="/contact" className="font-medium text-blue-600 hover:underline">
                        Contact us for Enterprise
                    </Link>
                </p>
            </div>
        </div>
    )
}
