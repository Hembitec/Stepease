"use client"

import { useState } from "react"
import {
    UserPlus, ShieldAlert, ClipboardCheck, HeartPulse,
    GitBranch, MessageSquareWarning, DatabaseBackup, Siren,
    Sparkles, ArrowRight, Wand2
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
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="w-12 h-12 bg-blue-100/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-200/50 shadow-sm">
                    <Wand2 className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 tracking-tight">
                    Create New SOP
                </h2>
                <p className="text-base text-slate-500 max-w-lg mx-auto">
                    How would you like to build your Standard Operating Procedure?
                </p>
            </div>

            {/* Main Option: Blank Canvas */}
            <div className="mb-12">
                <button
                    onClick={onSkip}
                    className="group flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 text-left transition-all duration-200 hover:border-blue-500 hover:bg-slate-50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <div className="flex items-center gap-5 sm:gap-6">
                        <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                            <Sparkles className="h-6 w-6 sm:h-7 sm:w-7" />
                        </div>
                        <div>
                            <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-1.5 tracking-tight group-hover:text-blue-600 transition-colors">
                                Start from a Blank Canvas
                            </h3>
                            <p className="text-sm sm:text-base text-slate-500 max-w-lg">
                                Chat with AI to build your unique procedure entirely from scratch.
                            </p>
                        </div>
                    </div>
                    <div className="hidden sm:flex shrink-0 items-center justify-center h-12 w-12 text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-600">
                        <ArrowRight className="h-6 w-6" />
                    </div>
                </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center mb-10">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="shrink-0 px-4 text-xs font-medium text-slate-400">
                    Or choose a starting template
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SOP_TEMPLATES.map((template) => {
                    const Icon = ICON_MAP[template.icon] || Sparkles

                    return (
                        <button
                            key={template.id}
                            onClick={() => onSelect(template)}
                            className="group text-left rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-slate-300 hover:shadow-sm"
                        >
                            <div className="flex items-start gap-4">
                                <div className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                                    template.color || "bg-slate-50 text-slate-600"
                                )}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
                                            {template.title}
                                        </h3>
                                        <ArrowRight className="w-4 h-4 flex-shrink-0 text-slate-300 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-slate-500" />
                                    </div>
                                    <p className="text-xs text-slate-500 mb-2.5 line-clamp-2 leading-relaxed">
                                        {template.description}
                                    </p>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-500">
                                        {template.industry}
                                    </span>
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
