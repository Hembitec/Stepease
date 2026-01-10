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
    { id: "extracting", label: "Extracting Text", icon: FileText },
    { id: "analyzing", label: "AI Analysis", icon: Brain },
    { id: "complete", label: "Complete", icon: CheckCircle2 },
]

export function ProcessingStepper({ stage, errorStage, errorMessage }: ProcessingStepperProps) {
    if (stage === "idle") return null

    const getStepStatus = (stepId: string): "pending" | "active" | "complete" | "error" => {
        const stepOrder = ["extracting", "analyzing", "complete"]
        const currentIndex = stepOrder.indexOf(stage === "error" ? "" : stage)
        const stepIndex = stepOrder.indexOf(stepId)

        // Handle error state
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
        <div className="w-full max-w-2xl mx-auto py-6">
            {/* Stepper */}
            <div className="flex items-center justify-center mb-4">
                {steps.map((step, index) => {
                    const status = getStepStatus(step.id)
                    const Icon = step.icon

                    return (
                        <div key={step.id} className="flex items-center flex-1">
                            {/* Step Circle */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                                        status === "pending" && "bg-muted text-muted-foreground",
                                        status === "active" && "bg-primary text-primary-foreground animate-pulse",
                                        status === "complete" && "bg-green-500 text-white",
                                        status === "error" && "bg-destructive text-destructive-foreground"
                                    )}
                                >
                                    {status === "active" ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : status === "error" ? (
                                        <AlertCircle className="w-5 h-5" />
                                    ) : (
                                        <Icon className="w-5 h-5" />
                                    )}
                                </div>
                                <span
                                    className={cn(
                                        "mt-2 text-xs font-medium text-center",
                                        status === "pending" && "text-muted-foreground",
                                        status === "active" && "text-primary",
                                        status === "complete" && "text-green-600",
                                        status === "error" && "text-destructive"
                                    )}
                                >
                                    {step.label}
                                </span>
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div
                                    className={cn(
                                        "flex-1 h-1 mx-3 rounded-full transition-all duration-300",
                                        getStepStatus(steps[index + 1].id) === "pending"
                                            ? "bg-muted"
                                            : "bg-green-500"
                                    )}
                                />
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Active Stage Message */}
            <div className="text-center">
                {stage === "extracting" && (
                    <p className="text-sm text-muted-foreground">
                        Reading and extracting text from your document...
                    </p>
                )}
                {stage === "analyzing" && (
                    <p className="text-sm text-muted-foreground">
                        AI is analyzing your SOP structure and quality...
                    </p>
                )}
                {stage === "complete" && (
                    <p className="text-sm text-green-600 font-medium">
                        Analysis complete!
                    </p>
                )}
                {stage === "error" && errorMessage && (
                    <p className="text-sm text-destructive">
                        {errorMessage}
                    </p>
                )}
            </div>
        </div>
    )
}
