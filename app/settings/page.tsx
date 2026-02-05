"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useSidebar } from "@/components/layout/sidebar-context"
import { SubscriptionCard, UpgradeModal } from "@/components/pricing"
import { UserProfile } from "@clerk/nextjs"
import { Menu } from "lucide-react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { SettingsSkeleton } from "@/components/skeletons"

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
              className="md:hidden p-1 -ml-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-50">
              Settings
            </h1>
          </div>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Manage your account preferences and application settings.
          </p>
        </div>

        {/* Subscription Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
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

        {/* User Profile Section */}
        <div className="flex justify-center">
          <UserProfile
            routing="hash"
            appearance={{
              elements: {
                rootBox: "w-full",
                cardBox:
                  "w-full shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm",
                card: "bg-transparent shadow-none",
                navbar:
                  "border-r border-slate-200/80 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50",
                navbarButton:
                  "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg",
                navbarButtonActive:
                  "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50",
                pageScrollBox: "p-4 sm:p-6",
                page: "gap-4 sm:gap-6",
                profileSection:
                  "border border-slate-200/80 dark:border-slate-700/50 rounded-xl p-4 bg-white dark:bg-slate-800/50",
                profileSectionTitle:
                  "text-slate-900 dark:text-slate-50 font-semibold",
                profileSectionContent: "text-slate-600 dark:text-slate-300",
                formButtonPrimary:
                  "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
                formButtonReset:
                  "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
                formFieldLabel: "text-slate-700 dark:text-slate-300 font-medium",
                formFieldInput:
                  "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-blue-500",
                headerTitle: "text-slate-900 dark:text-slate-50 font-bold",
                headerSubtitle: "text-slate-500 dark:text-slate-400",
                navbarMobileMenuButton:
                  "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700",
                navbarMobileMenuRow:
                  "hover:bg-slate-100 dark:hover:bg-slate-700/50",
                navbarMobileMenuRowIcon: "text-blue-600 dark:text-blue-400",
                badge:
                  "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
                identityPreview:
                  "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50",
                identityPreviewText: "text-slate-700 dark:text-slate-300",
                identityPreviewEditButton:
                  "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300",
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

