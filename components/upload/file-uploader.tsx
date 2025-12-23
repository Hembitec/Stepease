
"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { AnalysisResult } from "@/lib/sop-analyzer"

interface FileUploaderProps {
    onAnalysisComplete: (result: { analysis: AnalysisResult; processedFile: any }) => void
}

export function FileUploader({ onAnalysisComplete }: FileUploaderProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)

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

        setIsUploading(true)
        setError(null)

        const formData = new FormData()
        formData.append("file", file)

        try {
            const response = await fetch("/api/analyze-sop", {
                method: "POST",
                body: formData
            })

            if (!response.ok) throw new Error("Analysis failed")

            const data = await response.json()
            onAnalysisComplete(data)
        } catch (err) {
            setError("Failed to process file. Please try again.")
            console.error(err)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="w-full">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={cn(
                    "border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200",
                    isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-blue-400 hover:bg-slate-50",
                    isUploading && "pointer-events-none opacity-50"
                )}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,.txt,.md"
                    onChange={handleFileSelect}
                />

                {isUploading ? (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        <p className="text-sm text-slate-600 font-medium">Analyzing your SOP...</p>
                        <p className="text-xs text-slate-400">This usually takes 10-20 seconds</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                            <Upload className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-slate-900">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                                PDF, Word, or Text (max 10MB)
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm">{error}</p>
                </div>
            )}
        </div>
    )
}
