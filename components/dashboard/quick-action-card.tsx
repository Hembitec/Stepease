import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuickActionCardProps {
  icon: LucideIcon
  title: string
  description: string
  href: string
  buttonText: string
  variant?: "blue" | "green"
}

export function QuickActionCard({
  icon: Icon,
  title,
  description,
  href,
  buttonText,
  variant = "blue",
}: QuickActionCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-slate-300 transition-all group">
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
            variant === "blue" ? "bg-blue-100" : "bg-green-100",
          )}
        >
          <Icon className={cn("w-6 h-6", variant === "blue" ? "text-blue-600" : "text-green-600")} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-slate-900 mb-1">{title}</h3>
          <p className="text-slate-600 mb-4">{description}</p>
          <Link
            href={href}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
              variant === "blue"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white",
            )}
          >
            {buttonText}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}
