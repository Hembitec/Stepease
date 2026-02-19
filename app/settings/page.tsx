"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useSidebar } from "@/components/layout/sidebar-context"
import { SubscriptionCard, UpgradeModal } from "@/components/pricing"
import { UserProfile, useUser } from "@clerk/nextjs"
import { Menu } from "lucide-react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { SettingsSkeleton } from "@/components/skeletons"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cancelSubscriptionAction } from "@/app/actions/payment"

export default function SettingsPage() {
  const { toggleMobileMenu } = useSidebar()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  // Fetch real user data from Convex
  const userData = useQuery(api.users.getByClerkId)
  const syncUsage = useMutation(api.users.syncUsageFromSessions)

  // Auto-sync usage on mount if no user record exists
  useEffect(() => {
    if (userData === null) {
      syncUsage().catch(console.error)
    }
  }, [userData, syncUsage])

  // Show skeleton while loading (undefined means still fetching)
  if (userData === undefined) {
    return (
      <DashboardLayout>
        <SettingsSkeleton />
      </DashboardLayout>
    )
  }

  const tier = (userData?.tier ?? "free") as "free" | "starter" | "pro"
  const sopsCreated = userData?.sopsCreatedThisMonth ?? 0
  const improvesUsed = userData?.improvesUsedThisMonth ?? 0
  const sopsLimit = tier === "pro" ? Infinity : tier === "starter" ? 12 : 2
  const improvesLimit = tier === "pro" ? Infinity : tier === "starter" ? 5 : 0

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-1 sm:mb-2">
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-1 -ml-1 text-slate-600 hover:text-slate-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
              Settings
            </h1>
          </div>
          <p className="text-sm sm:text-base text-slate-500">
            Manage your account preferences and application settings.
          </p>
        </div>

        {/* Subscription Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Subscription
          </h2>
          <SubscriptionCard
            tier={tier}
            sopsCreated={sopsCreated}
            sopsLimit={sopsLimit}
            improvesUsed={improvesUsed}
            improvesLimit={improvesLimit}
            onUpgrade={() => setShowUpgradeModal(true)}
          />
        </div>

        {/* Billing Section (Only for paid tiers) */}
        {tier !== "free" && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Billing & Payment
            </h2>
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-900">Current Plan</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    You are currently on the <span className="font-semibold capitalize">{tier}</span> plan.
                  </p>
                  {userData?.usageResetAt && (
                    <p className="text-xs text-slate-400 mt-2">
                      Next billing cycle starts on {new Date(userData.usageResetAt).toLocaleDateString()}.
                    </p>
                  )}
                </div>
                <CancelSubscriptionButton />
              </div>
            </div>
          </div>
        )}

        {/* User Profile Section */}
        <div className="flex justify-center">
          <UserProfile
            routing="hash"
            appearance={{
              elements: {
                rootBox: "w-full",
                cardBox:
                  "w-full shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-sm",
                card: "bg-transparent shadow-none",
                navbar:
                  "border-r border-slate-200/80 bg-slate-50/50",
                navbarButton:
                  "text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg",
                navbarButtonActive:
                  "text-blue-600 bg-blue-50",
                pageScrollBox: "p-4 sm:p-6",
                page: "gap-4 sm:gap-6",
                profileSection:
                  "border border-slate-200/80 rounded-xl p-4 bg-white",
                profileSectionTitle:
                  "text-slate-900 font-semibold",
                profileSectionContent: "text-slate-600",
                formButtonPrimary:
                  "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
                formButtonReset:
                  "text-slate-600 hover:text-slate-900",
                formFieldLabel: "text-slate-700 font-medium",
                formFieldInput:
                  "border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-blue-500",
                headerTitle: "text-slate-900 font-bold",
                headerSubtitle: "text-slate-500",
                navbarMobileMenuButton:
                  "text-slate-600 hover:bg-slate-100",
                navbarMobileMenuRow:
                  "hover:bg-slate-100",
                navbarMobileMenuRowIcon: "text-blue-600",
                badge:
                  "bg-blue-100 text-blue-700 border-blue-200",
                identityPreview:
                  "border-slate-200 bg-slate-50 hover:bg-slate-100",
                identityPreviewText: "text-slate-700",
                identityPreviewEditButton:
                  "text-blue-600 hover:text-blue-700",
              },
              variables: {
                colorPrimary: "#2563eb",
                colorText: "#1e293b",
                colorTextSecondary: "#64748b",
                colorBackground: "transparent",
                borderRadius: "0.75rem",
              },
            }}
          />
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        triggerReason="manual"
      />
    </DashboardLayout>
  )
}

// -----------------------------------------------------------------------------
// HELPER COMPONENTS
// -----------------------------------------------------------------------------

function CancelSubscriptionButton() {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { user } = useUser()

  const handleCancel = async () => {
    setLoading(true)
    try {
      const email = user?.emailAddresses[0]?.emailAddress || ""
      const result = await cancelSubscriptionAction(email)
      if (result.success) {
        toast.success(result.message)
        setOpen(false)
        // Ideally refresh data
        window.location.reload()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <Button
        variant="outline"
        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
        onClick={() => setOpen(true)}
      >
        Cancel Subscription
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-200">
      <span className="text-sm text-slate-600 mr-2">Are you sure?</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(false)}
        disabled={loading}
      >
        Keep it
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={handleCancel}
        disabled={loading}
      >
        {loading ? "Cancelling..." : "Yes, Cancel"}
      </Button>
    </div>
  )
}
