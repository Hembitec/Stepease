"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useSidebar } from "@/components/layout/sidebar-context"
import { SubscriptionCard } from "@/components/pricing"
import { UserProfile } from "@clerk/nextjs"
import { Menu, User, Palette, CreditCard, Sparkles } from "lucide-react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { SettingsSkeleton } from "@/components/skeletons"
import { cn } from "@/lib/utils"
import { WatermarkSettings } from "@/components/settings/watermark-settings"
import { CancelSubscriptionButton } from "@/components/settings/cancel-subscription-button"
import { SettingsPlansPanel } from "@/components/settings/settings-plans-panel"

const tabs = [
  { id: "account", label: "Account", icon: User },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "billing", label: "Billing & Usage", icon: CreditCard },
  { id: "plans", label: "Plans", icon: Sparkles },
] as const

type TabId = (typeof tabs)[number]["id"]

function SettingsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toggleMobileMenu } = useSidebar()

  const tabParam = searchParams.get("tab") as TabId | null
  const [activeTab, setActiveTab] = useState<TabId>(
    tabParam && tabs.some((t) => t.id === tabParam) ? tabParam : "account"
  )

  // Sync tab with URL param changes
  useEffect(() => {
    if (tabParam && tabs.some((t) => t.id === tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId)
    router.replace(`/settings?tab=${tabId}`, { scroll: false })
  }

  // Fetch real user data from Convex
  const userData = useQuery(api.users.getByClerkId)
  const syncUsage = useMutation(api.users.syncUsageFromSessions)

  // Auto-sync usage on mount if no user record exists
  useEffect(() => {
    if (userData === null) {
      syncUsage().catch(console.error)
    }
  }, [userData, syncUsage])

  // Show skeleton while loading
  if (userData === undefined) {
    return <SettingsSkeleton />
  }

  const tier = (userData?.tier ?? "free") as "free" | "starter" | "pro"
  const sopsCreated = userData?.sopsCreatedThisMonth ?? 0
  const improvesUsed = userData?.improvesUsedThisMonth ?? 0
  const sopsLimit = tier === "pro" ? Infinity : tier === "starter" ? 12 : 2
  const improvesLimit = tier === "pro" ? Infinity : tier === "starter" ? 5 : 0

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
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
          Manage your account, branding, billing, and plan.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200 mb-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <nav className="flex gap-1" aria-label="Settings tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors -mb-px",
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Panels */}
      {activeTab === "account" && (
        <div className="flex justify-center">
          <UserProfile
            routing="hash"
            appearance={{
              elements: {
                rootBox: "w-full",
                cardBox:
                  "w-full shadow-sm rounded-xl border border-slate-200 bg-white",
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
      )}

      {activeTab === "branding" && (
        <div className="max-w-2xl">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            PDF Branding
          </h2>
          <WatermarkSettings tier={tier} />
        </div>
      )}

      {activeTab === "billing" && (
        <div className="space-y-6 max-w-2xl">
          {/* Subscription overview */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Subscription
            </h2>
            <SubscriptionCard
              tier={tier}
              sopsCreated={sopsCreated}
              sopsLimit={sopsLimit}
              improvesUsed={improvesUsed}
              improvesLimit={improvesLimit}
              onUpgrade={() => handleTabChange("plans")}
            />
          </div>

          {/* Billing details for paid users */}
          {tier !== "free" && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Billing & Payment
              </h2>
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
        </div>
      )}

      {activeTab === "plans" && (
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Choose Your Plan
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              No hidden fees. No surprises. Cancel anytime.
            </p>
          </div>
          <SettingsPlansPanel currentTier={tier} />
        </div>
      )}
    </div>
  )
}

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsContent />
      </Suspense>
    </DashboardLayout>
  )
}
