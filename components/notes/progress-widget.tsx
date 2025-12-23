import { cn } from "@/lib/utils"

interface ProgressWidgetProps {
  progress: number
  phase?: string
}

const phaseLabels: Record<string, string> = {
  foundation: "Gathering basics",
  process_discovery: "Mapping process steps",
  accountability: "Assigning roles",
  risk_quality: "Defining quality checks",
  finalization: "Final details",
  complete: "Ready to generate",
}

export function ProgressWidget({ progress, phase = "foundation" }: ProgressWidgetProps) {
  const getProgressColor = (value: number) => {
    if (value < 30) return "bg-red-500"
    if (value < 60) return "bg-amber-500"
    if (value < 85) return "bg-blue-500"
    return "bg-emerald-500"
  }

  const getStatusLabel = () => {
    if (progress < 25) return "Just getting started"
    if (progress < 50) return "Making progress"
    if (progress < 75) return "Almost there"
    if (progress < 100) return "Final touches"
    return "Complete!"
  }

  return (
    <div className="bg-background border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-foreground">SOP Completeness</span>
        <span className="text-xs text-muted-foreground">{getStatusLabel()}</span>
      </div>
      <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden mb-3">
        <div
          className={cn("h-full transition-all duration-500 rounded-full", getProgressColor(progress))}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-foreground">{progress}%</span>
        <span className="text-muted-foreground text-xs">{phaseLabels[phase] || "Processing..."}</span>
      </div>
    </div>
  )
}
