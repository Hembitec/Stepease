
"use client"

import { CheckCircle, AlertTriangle, XCircle, FileText, ChevronDown, ChevronUp, Star, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"
import type { AnalysisResult } from "@/lib/sop-analyzer"

interface AnalysisResultsProps {
  analysis: AnalysisResult
  processedFile: {
    metadata: {
      charCount: number
      wordCount: number
      pageCount?: number
    }
  }
  originalContent: string
  onStartImprovement: () => void
}

export function AnalysisResults({
  analysis,
  processedFile,
  originalContent,
  onStartImprovement,
}: AnalysisResultsProps) {
  const [showFullContent, setShowFullContent] = useState(false)

  const getPriorityIcon = (priority: "High" | "Medium" | "Low") => {
    switch (priority) {
      case "High":
        return <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
      case "Medium":
        return <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
      case "Low":
        return <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Executive Summary</h3>
        <p className="text-slate-600 leading-relaxed">{analysis.summary}</p>

        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-100">
          <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
            Overall Quality: {analysis.quality.overall}/100
          </div>
          <div className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
            Completeness: {analysis.structure.completenessScore}%
          </div>
          <div className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
            {processedFile.metadata.wordCount} words
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            Key Strengths
          </h4>
          <ul className="space-y-3">
            {analysis.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Recommended Improvements
          </h4>
          <ul className="space-y-4">
            {analysis.improvements.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-sm">
                {getPriorityIcon(item.priority)}
                <div>
                  <div className="font-medium text-slate-900 flex items-center gap-2">
                    {item.description}
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded border uppercase",
                      item.priority === "High" ? "bg-red-50 text-red-700 border-red-100" :
                        item.priority === "Medium" ? "bg-yellow-50 text-yellow-700 border-yellow-100" :
                          "bg-blue-50 text-blue-700 border-blue-100"
                    )}>
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-1 text-xs">{item.suggestion}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Structure Grid */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h4 className="font-semibold text-slate-900 mb-4">Structure Analysis</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Object.entries(analysis.structure)
            .filter(([key]) => key.startsWith("has"))
            .map(([key, value]) => (
              <div
                key={key}
                className={cn(
                  "text-xs px-3 py-2 rounded-lg border flex items-center justify-between",
                  value ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-700"
                )}
              >
                <span>{key.replace("has", "")}</span>
                {value ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
              </div>
            ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-end pt-4">
        <Button onClick={onStartImprovement} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02]">
          Start Improvement With AI
        </Button>
      </div>

      {/* Original Content Preview */}
      <div className="border-t border-slate-200 pt-8 mt-8">
        <Button
          variant="ghost"
          onClick={() => setShowFullContent(!showFullContent)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 pl-0"
        >
          {showFullContent ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {showFullContent ? "Hide Original Content" : "View Original Content"}
        </Button>

        {showFullContent && (
          <div className="mt-4 bg-slate-50 rounded-xl p-6 font-mono text-sm text-slate-700 overflow-x-auto border border-slate-200">
            <pre className="whitespace-pre-wrap">{originalContent}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
