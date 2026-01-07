"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useUser, useClerk } from "@clerk/nextjs"
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
  const { user } = useUser()
  const { signOut } = useClerk()

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
              {/* Logo */}
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/icon.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Name */}
              {!isMobileOpen && (
                <span className="text-lg font-bold text-white whitespace-nowrap flex-1">
                  Stepease
                </span>
              )}
              {isMobileOpen && (
                <span className="text-lg font-bold text-white whitespace-nowrap flex-1">
                  Stepease
                </span>
              )}

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
        <div className={cn("transition-all duration-200", isCollapsed && !isMobileOpen ? "py-3 px-0 flex justify-center" : "py-4 px-4")}>
          <Link
            href="/create"
            onClick={onMobileClose}
            className={cn(
              "flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-medium transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40",
              isCollapsed && !isMobileOpen
                ? "w-9 h-9 rounded-lg"
                : "w-full px-4 py-3 rounded-xl gap-3"
            )}
            title="Create New SOP"
          >
            <Plus className={cn("flex-shrink-0", isCollapsed && !isMobileOpen ? "w-5 h-5" : "w-5 h-5")} />
            {(!isCollapsed || isMobileOpen) && <span>New SOP</span>}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3">
          {(!isCollapsed || isMobileOpen) && (
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider px-3 mb-3">
              Menu
            </div>
          )}
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <li key={item.href} className={cn(isCollapsed && !isMobileOpen && "flex justify-center")}>
                  <Link
                    href={item.href}
                    onClick={onMobileClose}
                    className={cn(
                      "flex items-center gap-3 rounded-xl transition-all duration-200 group",
                      isCollapsed && !isMobileOpen
                        ? "w-9 h-9 justify-center p-0"
                        : "px-4 py-2.5",
                      // Only show background when expanded OR on hover
                      isCollapsed && !isMobileOpen
                        ? isActive
                          ? "text-white"
                          : "text-slate-400 hover:text-white"
                        : isActive
                          ? "bg-slate-800 text-white shadow-md"
                          : "hover:bg-slate-800/50 hover:text-white"
                    )}
                    title={isCollapsed && !isMobileOpen ? item.label : undefined}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5 flex-shrink-0 transition-colors duration-200",
                        isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-300"
                      )}
                    />
                    {(!isCollapsed || isMobileOpen) && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {isActive && <ChevronRight className="w-4 h-4 text-slate-500" />}
                      </>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="border-t border-slate-800 p-4">
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer",
              isCollapsed && !isMobileOpen ? "justify-center p-2" : "px-2 py-2"
            )}
            title={isCollapsed && !isMobileOpen ? user?.fullName || "User" : undefined}
          >
            <Avatar className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0 shadow-lg shadow-blue-500/25">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-medium">
                {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.fullName || "User"}</p>
                <p className="text-xs text-slate-500 truncate">{user?.primaryEmailAddress?.emailAddress || ""}</p>
              </div>
            )}
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-3 w-full mt-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-colors",
                  isCollapsed && !isMobileOpen ? "justify-center p-3" : "px-4 py-2.5"
                )}
                title={isCollapsed && !isMobileOpen ? "Sign out" : undefined}
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                {(!isCollapsed || isMobileOpen) && <span>Sign out</span>}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-900 border-slate-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Sign out of Stepease?</AlertDialogTitle>
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
    </>
  )
}


