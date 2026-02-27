"use client"

import { useState } from "react"
import {
    UserPlus, ShieldAlert, ClipboardCheck, HeartPulse,
    GitBranch, MessageSquareWarning, DatabaseBackup, Siren,
    Sparkles, ArrowRight,
} from "lucide-react"
import { SOP_TEMPLATES, type SOPTemplate } from "@/lib/sop-templates"
import { cn } from "@/lib/utils"

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    UserPlus,
    ShieldAlert,
    ClipboardCheck,
    HeartPulse,
    GitBranch,
    MessageSquareWarning,
    DatabaseBackup,
    Siren,
}

interface TemplatePickerProps {
    onSelect: (template: SOPTemplate) => void
    onSkip: () => void
}

export function TemplatePicker({ onSelect, onSkip }: TemplatePickerProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-1.5">
                    Start from a Template
                </h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                    Choose an industry-standard template to give the AI context, or start from scratch with a blank canvas.
                </p>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {SOP_TEMPLATES.map((template) => {
                    const Icon = ICON_MAP[template.icon] || Sparkles
                    const isHovered = hoveredId === template.id

                    return (
                        <button
                            key={template.id}
                            onClick={() => onSelect(template)}
                            onMouseEnter={() => setHoveredId(template.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            className={cn(
                                "group text-left rounded-xl border p-4 transition-all duration-200",
                                isHovered
                                    ? "border-blue-300 bg-blue-50/50 shadow-md ring-1 ring-blue-200"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                            )}
                        >
                            <div className="flex items-start gap-3">
                                <div className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                                    template.color
                                )}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                                            {template.title}
                                        </h3>
                                        <ArrowRight className={cn(
                                            "w-4 h-4 flex-shrink-0 transition-all",
                                            isHovered ? "text-blue-600 translate-x-0.5" : "text-slate-300"
                                        )} />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{template.description}</p>
                                    <span className="inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                                        {template.industry}
                                    </span>
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* Skip / Blank */}
            <div className="text-center">
                <button
                    onClick={onSkip}
                    className="text-sm text-slate-500 hover:text-blue-600 transition-colors underline underline-offset-2 decoration-slate-300 hover:decoration-blue-400"
                >
                    Or start from a blank canvas →
                </button>
            </div>
        </div>
    )
}
