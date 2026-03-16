"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  FolderOpen,
  Settings,
  LogOut,
  Plus,
  ChevronRight,
  ChevronLeft,
  X,
  SidebarClose,
  SidebarOpen,
  Crown,
  Lock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useUser, useClerk } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { UpgradeBadge } from "@/components/pricing"
import { UpgradeModal } from "@/components/pricing/upgrade-modal"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FolderOpen, label: "Library", href: "/library" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ isCollapsed, onToggle, isMobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useUser()
  const { signOut } = useClerk()
  const userData = useQuery(api.users.getByClerkId)
  const canCreateData = useQuery(api.users.checkCanCreate)

  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const tier = userData?.tier ?? "free"
  const isPro = tier === "pro"
  const isStarter = tier === "starter"

  const handleCreateClick = (e: React.MouseEvent) => {
    if (canCreateData && !canCreateData.canCreate) {
      e.preventDefault()
      setShowUpgradeModal(true)
    } else {
      onMobileClose?.()
      router.push("/create")
    }
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-slate-900 text-slate-300 flex flex-col z-50 transition-all duration-300 ease-in-out",
          // Desktop: collapsed or expanded
          "hidden md:flex",
          isCollapsed ? "md:w-20" : "md:w-64",
          // Mobile: overlay mode
          isMobileOpen && "!flex w-72"
        )}
      >
        {/* Header Row: Logo + Name + Toggle (or just Expand button when collapsed) */}
        <div
          className={cn(
            "flex items-center gap-3 py-5 border-b border-slate-800",
            isCollapsed && !isMobileOpen ? "px-4 justify-center" : "px-5"
          )}
        >
          {/* When collapsed on desktop: show only expand button */}
          {isCollapsed && !isMobileOpen ? (
            <button
              onClick={onToggle}
              className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Expand sidebar"
            >
              <SidebarOpen className="w-5 h-5" />
            </button>
          ) : (
            <>
              {/* Logo Text */}
              <span className="text-2xl font-bold text-white whitespace-nowrap flex-1 tracking-tight">
                Step<span className="text-blue-400">[</span>Ease<span className="text-blue-400">]</span>
              </span>

              {/* Toggle Button (desktop) / Close Button (mobile) */}
              {isMobileOpen ? (
                <button
                  onClick={onMobileClose}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  title="Close sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={onToggle}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  title="Collapse sidebar"
                >
                  <SidebarClose className="w-5 h-5" />
                </button>
              )}
            </>
          )}
        </div>

        {/* Quick Create Button */}
        <div className={cn("transition-all duration-200", isCollapsed && !isMobileOpen ? "py-3 px-0 flex justify-center" : "py-3 px-4")}>
          <button
            onClick={handleCreateClick}
            disabled={canCreateData === undefined}
            className={cn(
              "flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
              isCollapsed && !isMobileOpen
                ? "w-9 h-9 rounded-lg"
                : "w-full px-4 py-2.5 rounded-lg gap-2.5",
              (canCreateData && !canCreateData.canCreate) || canCreateData === undefined ? "opacity-80" : ""
            )}
            title={canCreateData === undefined ? "Loading..." : canCreateData && !canCreateData.canCreate ? "Upgrade to create more SOPs" : "Create New SOP"}
          >
            {canCreateData === undefined ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0" />
            ) : canCreateData && !canCreateData.canCreate ? (
              <Lock className={cn("flex-shrink-0", isCollapsed && !isMobileOpen ? "w-5 h-5" : "w-5 h-5")} />
            ) : (
              <Plus className={cn("flex-shrink-0", isCollapsed && !isMobileOpen ? "w-5 h-5" : "w-5 h-5")} />
            )}
            {(!isCollapsed || isMobileOpen) && (
              <span>{canCreateData === undefined ? "Loading..." : canCreateData && !canCreateData.canCreate ? "Upgrade" : "New SOP"}</span>
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3">
          <ul className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <li key={item.href} className={cn(isCollapsed && !isMobileOpen && "flex justify-center")}>
                  <Link
                    href={item.href}
                    onClick={onMobileClose}
                    className={cn(
                      "flex items-center gap-3 rounded-lg transition-colors group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
                      isCollapsed && !isMobileOpen
                        ? "w-9 h-9 justify-center p-0"
                        : "px-3 py-2.5",
                      isActive
                        ? "bg-slate-800 text-white"
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                    )}
                    title={isCollapsed && !isMobileOpen ? item.label : undefined}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5 flex-shrink-0 transition-colors",
                        isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-300"
                      )}
                    />
                    {(!isCollapsed || isMobileOpen) && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {isActive && <ChevronRight className="w-4 h-4 text-blue-400" />}
                      </>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Upgrade Badge */}
        {tier === "free" && (
          <div className="px-3 py-2">
            <UpgradeBadge isCollapsed={isCollapsed} isMobileOpen={isMobileOpen} />
          </div>
        )}

        {/* Profile Card */}
        <div className={cn(
          "border-t border-slate-800/50 p-3",
          isCollapsed && !isMobileOpen && "flex flex-col items-center gap-2"
        )}>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className={cn(
                  "w-full flex items-center rounded-lg transition-colors hover:bg-slate-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 group",
                  isCollapsed && !isMobileOpen ? "justify-center p-2" : "gap-3 px-3 py-2.5"
                )}
                title={isCollapsed && !isMobileOpen ? `${user?.fullName || "User"} · Sign out` : undefined}
              >
                <Avatar className="w-8 h-8 bg-blue-600 flex-shrink-0">
                  <AvatarFallback className="bg-blue-600 text-white text-xs font-medium">
                    {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                {(!isCollapsed || isMobileOpen) && (
                  <>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-medium text-white truncate">{user?.fullName || "User"}</p>
                        {userData === undefined ? (
                          <div className="h-4 w-10 bg-slate-700/50 rounded animate-pulse flex-shrink-0" />
                        ) : isPro ? (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-600/20 text-blue-400 flex-shrink-0">
                            <Crown className="w-2.5 h-2.5" />
                            Pro
                          </span>
                        ) : isStarter ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 flex-shrink-0">
                            Starter
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-700/60 text-slate-400 flex-shrink-0">
                            Free
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate">{user?.primaryEmailAddress?.emailAddress || ""}</p>
                    </div>
                    <LogOut className="w-4 h-4 flex-shrink-0 text-slate-500 group-hover:text-red-400 transition-colors" />
                  </>
                )}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-900 border-slate-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Sign out of Step[Ease]?</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  You will be redirected to the landing page. Any unsaved changes may be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => signOut({ redirectUrl: '/' })}
                  className="bg-red-600 hover:bg-red-700 text-white border-0"
                >
                  Sign out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </aside>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        triggerReason="create_limit"
      />
    </>
  )
}


