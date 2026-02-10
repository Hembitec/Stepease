"use client"

import { cn } from "@/lib/utils"
import { FileText, Brain, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

export type ProcessingStage = "idle" | "extracting" | "analyzing" | "complete" | "error"
export type ErrorStage = "extraction" | "analysis" | null

interface ProcessingStepperProps {
    stage: ProcessingStage
    errorStage?: ErrorStage
    errorMessage?: string
}

const steps = [
    {
        id: "extracting",
        label: "Extracting Text",
        description: "Reading and parsing your document content...",
        icon: FileText,
    },
    {
        id: "analyzing",
        label: "AI Analysis",
        description: "Evaluating structure, quality, and completeness...",
        icon: Brain,
    },
    {
        id: "complete",
        label: "Analysis Complete",
        description: "Your document has been fully analyzed.",
        icon: CheckCircle2,
    },
]

export function ProcessingStepper({ stage, errorStage, errorMessage }: ProcessingStepperProps) {
    if (stage === "idle") return null

    const getStepStatus = (stepId: string): "pending" | "active" | "complete" | "error" => {
        const stepOrder = ["extracting", "analyzing", "complete"]
        const currentIndex = stepOrder.indexOf(stage === "error" ? "" : stage)
        const stepIndex = stepOrder.indexOf(stepId)

        if (stage === "error") {
            if (errorStage === "extraction" && stepId === "extracting") return "error"
            if (errorStage === "analysis" && stepId === "extracting") return "complete"
            if (errorStage === "analysis" && stepId === "analyzing") return "error"
            return "pending"
        }

        if (stepIndex < currentIndex) return "complete"
        if (stepIndex === currentIndex) return "active"
        return "pending"
    }

    return (
        <div className="w-full max-w-md mx-auto py-8 px-4">
            <div className="relative">
                {steps.map((step, index) => {
                    const status = getStepStatus(step.id)
                    const Icon = step.icon
                    const isLast = index === steps.length - 1

                    return (
                        <div key={step.id} className="relative flex gap-4">
                            {/* Vertical connector line */}
                            {!isLast && (
                                <div className="absolute left-5 top-10 w-0.5 h-[calc(100%-8px)]">
                                    <div
                                        className={cn(
                                            "w-full h-full rounded-full transition-all duration-700",
                                            status === "complete"
                                                ? "bg-green-400"
                                                : "bg-slate-200"
                                        )}
                                    />
                                </div>
                            )}

                            {/* Step circle */}
                            <div className="relative z-10 flex-shrink-0">
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                                        status === "pending" && "bg-slate-100 text-slate-400",
                                        status === "active" && "bg-blue-600 text-white shadow-lg shadow-blue-600/30",
                                        status === "complete" && "bg-green-500 text-white",
                                        status === "error" && "bg-red-500 text-white"
                                    )}
                                >
                                    {status === "active" ? (
                                        <Loader2 className="w-4.5 h-4.5 animate-spin" />
                                    ) : status === "error" ? (
                                        <AlertCircle className="w-4.5 h-4.5" />
                                    ) : status === "complete" ? (
                                        <CheckCircle2 className="w-4.5 h-4.5" />
                                    ) : (
                                        <Icon className="w-4.5 h-4.5" />
                                    )}
                                </div>
                                {/* Pulse ring for active step */}
                                {status === "active" && (
                                    <div className="absolute inset-0 rounded-full bg-blue-600/20 animate-ping" />
                                )}
                            </div>

                            {/* Step content */}
                            <div className={cn("pb-8", isLast && "pb-0")}>
                                <h4
                                    className={cn(
                                        "text-sm font-semibold leading-tight mt-2.5 transition-colors duration-300",
                                        status === "pending" && "text-slate-400",
                                        status === "active" && "text-slate-900",
                                        status === "complete" && "text-green-700",
                                        status === "error" && "text-red-700"
                                    )}
                                >
                                    {step.label}
                                </h4>
                                <p
                                    className={cn(
                                        "text-xs mt-1 leading-relaxed transition-colors duration-300",
                                        status === "active" ? "text-slate-500" : "text-slate-400",
                                        status === "error" && "text-red-500"
                                    )}
                                >
                                    {status === "error" && errorMessage
                                        ? errorMessage
                                        : step.description}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
