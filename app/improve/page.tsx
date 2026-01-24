"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, HelpCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FileUploader } from "@/components/upload/file-uploader"
import { AnalysisResults } from "@/components/upload/analysis-results"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useSOPContext } from "@/lib/sop-context"
import type { AnalysisResult } from "@/lib/sop-analyzer"

type Phase = "upload" | "results"

interface AnalysisData {
  analysis: AnalysisResult
  processedFile: {
    content: string
    metadata: {
      charCount: number
      wordCount: number
      pageCount?: number
      title?: string
    }
  }
}

export default function ImproveSOPPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { startImprovementSession } = useSOPContext()
  const [phase, setPhase] = useState<Phase>("upload")
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [pastedText, setPastedText] = useState("")
  const [isAnalyzingText, setIsAnalyzingText] = useState(false)

  // Redirect if session param exists (bookmarked URL or stale link)
  const sessionId = searchParams.get('session')
  useEffect(() => {
    if (sessionId) {
      router.replace(`/create?mode=improve&session=${sessionId}`)
    }
  }, [sessionId, router])

  const handleAnalysisComplete = (data: AnalysisData) => {
    setAnalysisData(data)
    setPhase("results")
  }

  const handleTextAnalysis = async () => {
    if (!pastedText.trim()) return

    setIsAnalyzingText(true)
    try {
      // Create a dummy file for the API
      const blob = new Blob([pastedText], { type: "text/plain" })
      const file = new File([blob], "manual-entry.txt", { type: "text/plain" })

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/analyze-sop", {
        method: "POST",
        body: formData
      })

      if (!response.ok) throw new Error("Analysis failed")

      const data = await response.json()
      handleAnalysisComplete(data)
    } catch (error) {
      console.error("Text analysis failed:", error)
      // Error handling would go here (toast or state)
    } finally {
      setIsAnalyzingText(false)
    }
  }

  const handleStartImprovement = () => {
    if (analysisData) {
      startImprovementSession(analysisData.processedFile.content, analysisData.analysis)
      router.push("/create?mode=improve")
    }
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <h1 className="text-lg font-semibold text-slate-900">Improve Existing SOP</h1>
          <Button variant="ghost" size="sm" className="gap-2 text-slate-500">
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Help</span>
          </Button>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-12">
          {phase === "upload" && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-slate-900">Upload Your Current SOP</h2>
                <p className="text-slate-600 max-w-lg mx-auto">
                  Upload your document or paste the text below. Our AI will analyze the structure, identify gaps, and help you improve it.
                </p>
              </div>

              <FileUploader onAnalysisComplete={handleAnalysisComplete} />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-slate-50 text-slate-400 text-sm font-medium uppercase tracking-wider">
                    Or paste text directly
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-slate-700 font-medium">
                  <FileText className="w-4 h-4" />
                  <label>Manual Entry</label>
                </div>
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste your specific procedure, policy, or full SOP content here..."
                  className="w-full h-48 p-4 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono bg-slate-50 transition-colors"
                />
                <div className="flex justify-end mt-4">
                  <Button
                    onClick={handleTextAnalysis}
                    disabled={!pastedText.trim() || isAnalyzingText}
                    className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]"
                  >
                    {isAnalyzingText ? "Analyzing..." : "Analyze Text"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {phase === "results" && analysisData && (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Analysis Complete</h2>
                <p className="text-slate-600">
                  We've analyzed your document. Review the findings below.
                </p>
              </div>

              <AnalysisResults
                analysis={analysisData.analysis}
                processedFile={analysisData.processedFile}
                originalContent={analysisData.processedFile.content}
                onStartImprovement={handleStartImprovement}
              />
            </div>
          )}
        </main>
      </div>
    </DashboardLayout>
  )
}
