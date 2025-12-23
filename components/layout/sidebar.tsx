"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FolderOpen,
  Settings,
  FileText,
  LogOut,
  Plus,
  ChevronRight,
  ChevronLeft,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

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
        {/* Header Row: Logo + Name + Toggle */}
        <div
          className={cn(
            "flex items-center gap-3 py-5 border-b border-slate-800",
            isCollapsed && !isMobileOpen ? "px-4 justify-center" : "px-5"
          )}
        >
          {/* Logo */}
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25 flex-shrink-0">
            <FileText className="w-5 h-5 text-white" />
          </div>

          {/* Name - hidden when collapsed on desktop, always shown on mobile */}
          {(!isCollapsed || isMobileOpen) && (
            <span className="text-lg font-bold text-white whitespace-nowrap flex-1">
              StepWise
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
              className={cn(
                "w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors",
                isCollapsed && "hidden"
              )}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Expand button when collapsed (desktop only) */}
        {isCollapsed && !isMobileOpen && (
          <div className="px-3 py-3 border-b border-slate-800">
            <button
              onClick={onToggle}
              className="w-full h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Expand sidebar"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Quick Create Button */}
        <div className={cn("py-4", isCollapsed && !isMobileOpen ? "px-3" : "px-4")}>
          <Link
            href="/create"
            onClick={onMobileClose}
            className={cn(
              "flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-medium transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40",
              isCollapsed && !isMobileOpen
                ? "w-10 h-10 rounded-lg"
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
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onMobileClose}
                    className={cn(
                      "flex items-center gap-3 rounded-xl transition-all duration-200 group",
                      isCollapsed && !isMobileOpen
                        ? "justify-center p-2.5"
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
            title={isCollapsed && !isMobileOpen ? "John Doe" : undefined}
          >
            <Avatar className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0 shadow-lg shadow-blue-500/25">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-medium">
                JD
              </AvatarFallback>
            </Avatar>
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">John Doe</p>
                <p className="text-xs text-slate-500 truncate">john@company.com</p>
              </div>
            )}
          </div>
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
        </div>
      </aside>
    </>
  )
}


