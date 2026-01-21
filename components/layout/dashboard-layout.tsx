"use client"

import type React from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { useSidebar } from "@/components/layout/sidebar-context"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  fullHeight?: boolean
}

export function DashboardLayout({ children, fullHeight = false }: DashboardLayoutProps) {
  const { isCollapsed, isMobile, isMobileOpen, toggleSidebar, closeMobileMenu } = useSidebar()

  return (
    <div className={cn(
      "bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/30",
      fullHeight ? "h-screen overflow-hidden" : "min-h-screen"
    )}>
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={toggleSidebar}
        isMobileOpen={isMobileOpen}
        onMobileClose={closeMobileMenu}
      />

      <main
        className={cn(
          "transition-all duration-300 ease-in-out",
          fullHeight ? "h-screen overflow-hidden" : "min-h-screen",
          // Mobile: no top padding needed now as we removed the header
          isMobile ? "ml-0" : isCollapsed ? "ml-20" : "ml-64"
        )}
      >
        {children}
      </main>
    </div>
  )
}
