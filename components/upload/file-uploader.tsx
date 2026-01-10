
"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AnalysisResult } from "@/lib/sop-analyzer"
import { ProcessingStepper, type ProcessingStage, type ErrorStage } from "./processing-stepper"

interface FileUploaderProps {
    onAnalysisComplete: (result: { analysis: AnalysisResult; processedFile: any }) => void
}

export function FileUploader({ onAnalysisComplete }: FileUploaderProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [processingStage, setProcessingStage] = useState<ProcessingStage>("idle")
    const [errorStage, setErrorStage] = useState<ErrorStage>(null)
    const [error, setError] = useState<string | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)

    const isProcessing = processingStage !== "idle" && processingStage !== "error"

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
    }, [])

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleFile(file)
    }, [])

    const resetState = () => {
        setProcessingStage("idle")
        setErrorStage(null)
        setError(null)
    }

    const handleFile = async (file: File) => {
        // Validation
        const validTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain"
        ]
        if (!validTypes.includes(file.type) && !file.name.endsWith(".md")) {
            setError("Please upload a PDF, Word (.docx), or Text file.")
            return
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB
            setError("File size must be under 10MB.")
            return
        }

        // Reset and start EXTRACTION stage
        resetState()
        setProcessingStage("extracting")

        const formData = new FormData()
        formData.append("file", file)

        try {
            // Step 1: EXTRACTION
            const extractResponse = await fetch("/api/extract-file", {
                method: "POST",
                body: formData
            })

            const extractData = await extractResponse.json()

            if (!extractResponse.ok) {
                setProcessingStage("error")
                setErrorStage("extraction")
                setError(extractData.error || "Failed to extract text from file.")
                return
            }

            // Step 2: ANALYSIS - Now update to analysis stage
            setProcessingStage("analyzing")

            const analyzeResponse = await fetch("/api/analyze-content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: extractData.processedFile.content })
            })

            const analyzeData = await analyzeResponse.json()

            if (!analyzeResponse.ok) {
                setProcessingStage("error")
                setErrorStage("analysis")
                setError(analyzeData.error || "Failed to analyze SOP content.")
                return
            }

            // Step 3: COMPLETE
            setProcessingStage("complete")

            // Small delay to show completion state before transitioning
            await new Promise(resolve => setTimeout(resolve, 500))

            onAnalysisComplete({
                processedFile: extractData.processedFile,
                analysis: analyzeData.analysis
            })

        } catch (err) {
            setProcessingStage("error")
            setErrorStage("extraction")
            setError("Network error. Please check your connection and try again.")
            console.error(err)
        }
    }

    return (
        <div className="w-full">
            {/* Processing Stepper - shown during processing or error */}
            {processingStage !== "idle" && (
                <ProcessingStepper
                    stage={processingStage}
                    errorStage={errorStage}
                    errorMessage={error || undefined}
                />
            )}

            {/* Upload Zone - shown when idle or on error */}
            {(processingStage === "idle" || processingStage === "error") && (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !isProcessing && fileInputRef.current?.click()}
                    className={cn(
                        "border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200",
                        isDragging
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 hover:bg-muted/50",
                        isProcessing && "pointer-events-none opacity-50"
                    )}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.docx,.txt,.md"
                        onChange={handleFileSelect}
                    />

                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                            <Upload className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-foreground">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                PDF, Word, or Text (max 10MB)
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error without stepper context (validation errors) */}
            {error && processingStage === "idle" && (
                <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {/* Retry button on error */}
            {processingStage === "error" && (
                <div className="mt-4 text-center">
                    <button
                        onClick={resetState}
                        className="text-sm text-primary hover:underline font-medium"
                    >
                        Try uploading a different file
                    </button>
                </div>
            )}
        </div>
    )
}
