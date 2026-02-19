"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { useSearchParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useSOPContext } from "@/lib/sop-context"
import { useSidebar } from "@/components/layout/sidebar-context"
import { useUser } from "@clerk/nextjs"
import { DashboardSkeleton } from "@/components/skeletons"
import {
  Sparkles,
  Upload,
  ArrowRight,
  FileText,
  Clock,
  CheckCircle2,
  Plus,
  Calendar,
  Menu,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DraftsSection } from "@/components/dashboard/drafts-section"
import { UpgradeModal } from "@/components/pricing/upgrade-modal"

export default function DashboardPage() {
  const router = useRouter()
  const { sops } = useSOPContext()
  const { toggleMobileMenu } = useSidebar()
  const { user } = useUser()

  // Usage limit checks
  const canCreateData = useQuery(api.users.checkCanCreate)
  const canImproveData = useQuery(api.users.checkCanImprove)

  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeReason, setUpgradeReason] = useState<"create" | "improve" | "manual">("create")

  const searchParams = useSearchParams()
  const hasShownToast = useRef(false)

  useEffect(() => {
    // Handle payment success — only show toast once
    if (searchParams.get("payment") === "success" && !hasShownToast.current) {
      hasShownToast.current = true
      toast.success("Subscription upgraded successfully!", {
        description: "You now have access to all premium features.",
        duration: 5000,
      })
      // Clean up URL
      router.replace("/dashboard")
    }

    // Handle upgrade triggers from landing page
    const upgradeParam = searchParams.get("upgrade")
    if (upgradeParam === "starter" || upgradeParam === "pro") {
      setShowUpgradeModal(true)
      setUpgradeReason("manual")
    }
  }, [searchParams, router])

  const sessions = useQuery(api.sessions.list) ?? []
  const recentSOPs = sops.slice(0, 5)

  const draftCount = sessions.length
  const completeCount = sops.filter((s) => s.status === "complete").length

  const handleCreateClick = () => {
    if (canCreateData && !canCreateData.canCreate) {
      setUpgradeReason("create")
      setShowUpgradeModal(true)
    } else {
      router.push("/create")
    }
  }

  const handleImproveClick = () => {
    if (canImproveData && !canImproveData.canImprove) {
      setUpgradeReason("improve")
      setShowUpgradeModal(true)
    } else {
      router.push("/improve")
    }
  }

  const currentHour = new Date().getHours()
  const greeting =
    currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening"
  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  // Show skeleton while data is loading
  const isLoading = sessions === undefined || canCreateData === undefined
  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleMobileMenu}
                  className="md:hidden p-1 -ml-1 text-slate-600 hover:text-slate-900"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
                  {greeting}, {user?.firstName || "there"} 👋
                </h1>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Pick up where you left off or start something new.
              </p>
            </div>
            <Button
              onClick={handleCreateClick}
              className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all text-sm"
            >
              {canCreateData && !canCreateData.canCreate ? (
                <Lock className="w-4 h-4 mr-1.5" />
              ) : (
                <Plus className="w-4 h-4 mr-1.5" />
              )}
              New SOP
            </Button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard
            icon={<FileText className="w-5 h-5 text-blue-600" />}
            label="Total SOPs"
            value={sops.length}
            color="blue"
          />
          <StatCard
            icon={<Clock className="w-5 h-5 text-amber-600" />}
            label="In Progress"
            value={draftCount}
            color="amber"
            badge={draftCount > 0 ? "Active" : undefined}
          />
          <StatCard
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            label="Completed"
            value={completeCount}
            color="emerald"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Create New SOP */}
          <div onClick={handleCreateClick} className="group cursor-pointer">
            <div className={cn(
              "relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-5 sm:p-6 text-white transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/20",
              canCreateData && !canCreateData.canCreate && "opacity-75"
            )}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="w-10 h-10 bg-white/15 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {canCreateData && !canCreateData.canCreate ? (
                    <Lock className="w-5 h-5" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-1">Create New SOP</h3>
                <p className="text-blue-100 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2">
                  {canCreateData && !canCreateData.canCreate
                    ? "Monthly limit reached. Upgrade to continue."
                    : "AI-powered SOP creation in minutes."}
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                  {canCreateData && !canCreateData.canCreate ? "Upgrade" : "Get started"}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </div>

          {/* Improve Existing */}
          <div onClick={handleImproveClick} className="group cursor-pointer">
            <div className={cn(
              "relative overflow-hidden bg-white rounded-xl p-5 sm:p-6 border border-slate-200 transition-all duration-200 hover:shadow-lg hover:border-emerald-200",
              canImproveData && !canImproveData.canImprove && "opacity-75"
            )}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {canImproveData && !canImproveData.canImprove ? (
                    <Lock className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Upload className="w-5 h-5 text-emerald-600" />
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1">Improve Existing</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2">
                  {canImproveData && !canImproveData.canImprove
                    ? "Monthly limit reached. Upgrade for more."
                    : "Upload SOPs for AI analysis and enhancement."}
                </p>
                <span className={cn(
                  "inline-flex items-center gap-1.5 text-xs font-medium",
                  canImproveData && !canImproveData.canImprove
                    ? "text-amber-600"
                    : "text-emerald-600"
                )}>
                  {canImproveData && !canImproveData.canImprove ? "Upgrade" : "Upload file"}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* In Progress Sessions */}
        <DraftsSection />

        {/* Recent SOPs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Recent Documents</h2>
            {recentSOPs.length > 0 && (
              <Link
                href="/library"
                className="text-blue-600 hover:text-blue-700 text-xs font-medium inline-flex items-center gap-1 hover:gap-1.5 transition-all"
              >
                View all
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {recentSOPs.length > 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="divide-y divide-slate-100">
                {recentSOPs.map((sop) => (
                  <Link
                    key={sop.id}
                    href={sop.status === "draft" ? `/create?id=${sop.id}` : `/preview/${sop.id}`}
                    className="flex items-center gap-3 sm:gap-4 px-4 py-3 hover:bg-slate-50 transition-colors group"
                  >
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                      sop.status === "complete"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    )}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {sop.title}
                      </h4>
                      <p className="text-xs text-slate-400">{sop.department}</p>
                    </div>
                    <div className={cn(
                      "px-2 py-0.5 rounded text-[11px] font-medium hidden sm:block",
                      sop.status === "complete"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    )}>
                      {sop.status === "complete" ? "Complete" : "Draft"}
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 text-center">
              <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1.5">No SOPs yet</h3>
              <p className="text-sm text-slate-500 mb-5 max-w-xs mx-auto">
                Create your first SOP to streamline your processes.
              </p>
              <Link href="/create">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Create Your First SOP
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        triggerReason={upgradeReason === "create" ? "create_limit" : "improve_limit"}
      />
    </DashboardLayout>
  )
}

// -----------------------------------------------------------------------------
// Stat Card Component
// -----------------------------------------------------------------------------

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number
  color: "blue" | "amber" | "emerald"
  badge?: string
}

function StatCard({ icon, label, value, color, badge }: StatCardProps) {
  const bgMap = { blue: "bg-blue-50", amber: "bg-amber-50", emerald: "bg-emerald-50" }
  const badgeMap = {
    blue: "bg-blue-100 text-blue-700",
    amber: "bg-amber-100 text-amber-700",
    emerald: "bg-emerald-100 text-emerald-700",
  }

  return (
    <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 hover:border-slate-300 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className={cn("w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center", bgMap[color])}>
          {icon}
        </div>
        {badge && (
          <span className={cn("text-[10px] sm:text-[11px] font-medium px-1.5 py-0.5 rounded", badgeMap[color])}>
            {badge}
          </span>
        )}
      </div>
      <p className="text-[11px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <span className="text-xl sm:text-2xl font-bold text-slate-900">{value}</span>
    </div>
  )
}
