"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  FolderOpen,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  X,
  SidebarClose,
  SidebarOpen,
  Crown,
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

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

  const tier = userData?.tier ?? "free"
  const isPro = tier === "pro"
  const isStarter = tier === "starter"

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-slate-950/95 backdrop-blur-xl text-slate-300 flex flex-col z-50 transition-all duration-300 ease-in-out border-r border-slate-800/60 shadow-2xl",
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
            "flex items-center gap-3 py-6 border-b border-slate-800/50",
            isCollapsed && !isMobileOpen ? "px-4 justify-center" : "px-6"
          )}
        >
          {/* When collapsed on desktop: show only expand button */}
          {isCollapsed && !isMobileOpen ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onToggle}
                  className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-all duration-300 hover:shadow-lg"
                >
                  <SidebarOpen className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10} className="bg-slate-800 border-slate-700 text-slate-200">
                Expand sidebar
              </TooltipContent>
            </Tooltip>
          ) : (
            <>
              {/* Logo Text */}
              <span className="text-2xl font-bold whitespace-nowrap flex-1 tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Step<span className="text-blue-500">[</span>Ease<span className="text-blue-500">]</span>
              </span>

              {/* Toggle Button (desktop) / Close Button (mobile) */}
              {isMobileOpen ? (
                <button
                  onClick={onMobileClose}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-all duration-300"
                  title="Close sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={onToggle}
                      className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-all duration-300"
                    >
                      <SidebarClose className="w-5 h-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10} className="bg-slate-800 border-slate-700 text-slate-200">
                    Collapse sidebar
                  </TooltipContent>
                </Tooltip>
              )}
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              
              const LinkContent = (
                <Link
                  href={item.href}
                  onClick={onMobileClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg transition-all duration-300 group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                    isCollapsed && !isMobileOpen
                      ? "w-10 h-10 justify-center p-0"
                      : "px-4 py-3",
                    isActive
                      ? "bg-gradient-to-r from-blue-600/10 to-transparent text-white border-l-2 border-blue-500 shadow-sm"
                      : "text-slate-400 hover:bg-slate-800/40 hover:text-white border-l-2 border-transparent"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0 transition-all duration-300",
                      isActive ? "text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" : "text-slate-400 group-hover:text-slate-200",
                      (!isCollapsed || isMobileOpen) && "group-hover:scale-110"
                    )}
                  />
                  {(!isCollapsed || isMobileOpen) && (
                    <>
                      <span className="flex-1 font-medium tracking-wide transition-transform duration-300 group-hover:translate-x-1">{item.label}</span>
                      {isActive && <ChevronRight className="w-4 h-4 text-blue-500 transition-transform duration-300" />}
                    </>
                  )}
                </Link>
              )

              return (
                <li key={item.href} className={cn(isCollapsed && !isMobileOpen && "flex justify-center")}>
                  {isCollapsed && !isMobileOpen ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {LinkContent}
                      </TooltipTrigger>
                      <TooltipContent side="right" sideOffset={10} className="bg-slate-800 border-slate-700 text-slate-200 font-medium">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    LinkContent
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Upgrade Badge */}
        {tier === "free" && (
          <div className="px-4 pb-4">
            <UpgradeBadge isCollapsed={isCollapsed} isMobileOpen={isMobileOpen} />
          </div>
        )}

        {/* Profile Card */}
        <div className={cn(
          "border-t border-slate-800/50 p-4 bg-slate-900/30",
          isCollapsed && !isMobileOpen && "flex flex-col items-center gap-2"
        )}>
          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <button
                    className={cn(
                      "w-full flex items-center rounded-xl transition-all duration-300 hover:bg-slate-800/80 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 group",
                      isCollapsed && !isMobileOpen ? "justify-center p-2.5" : "gap-3 px-3 py-3"
                    )}
                  >
                    <Avatar className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0 shadow-inner">
                      <AvatarFallback className="bg-transparent text-white text-sm font-semibold">
                        {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {(!isCollapsed || isMobileOpen) && (
                      <>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-white truncate group-hover:text-blue-100 transition-colors">{user?.fullName || "User"}</p>
                            {userData === undefined ? (
                              <div className="h-4 w-10 bg-slate-700/50 rounded animate-pulse flex-shrink-0" />
                            ) : isPro ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/20 text-blue-400 flex-shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.2)] border border-blue-500/20">
                                <Crown className="w-3 h-3 drop-shadow-md" />
                                PRO
                              </span>
                            ) : isStarter ? (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/20 text-indigo-400 flex-shrink-0 border border-indigo-500/20">
                                STARTER
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-700/60 text-slate-400 flex-shrink-0 border border-slate-600/50">
                                FREE
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 truncate mt-0.5">{user?.primaryEmailAddress?.emailAddress || ""}</p>
                        </div>
                        <LogOut className="w-4 h-4 flex-shrink-0 text-slate-500 group-hover:text-red-400 transition-colors duration-300" />
                      </>
                    )}
                  </button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              {isCollapsed && !isMobileOpen && (
                <TooltipContent side="right" sideOffset={10} className="bg-slate-800 border-slate-700 text-slate-200">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-white">{user?.fullName || "User"}</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <LogOut className="w-3 h-3" /> Sign out
                    </span>
                  </div>
                </TooltipContent>
              )}
            </Tooltip>

            <AlertDialogContent className="bg-slate-950 border-slate-800 shadow-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white text-xl">Sign out of Step[Ease]?</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400 text-base">
                  You will be redirected to the landing page. Any unsaved changes may be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-6 gap-3">
                <AlertDialogCancel className="bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => signOut({ redirectUrl: '/' })}
                  className="bg-red-600 hover:bg-red-700 text-white border-0 transition-colors shadow-lg shadow-red-900/20"
                >
                  Sign out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </aside>
    </>
  )
}
