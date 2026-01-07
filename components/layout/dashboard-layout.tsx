"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { cn } from "@/lib/utils"
import { Menu, FileText } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
  fullHeight?: boolean
}

export function DashboardLayout({ children, fullHeight = false }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)

      // Auto-collapse on tablet screens (768-1024px)
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setIsCollapsed(true)
      }

      // Close mobile menu when resizing to desktop
      if (!mobile) {
        setIsMobileMenuOpen(false)
      }
    }

    // Check on mount
    checkScreenSize()

    // Listen for resize
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className={cn(
      "bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/30",
      fullHeight ? "h-screen overflow-hidden" : "min-h-screen"
    )}>
      {/* Mobile Top Navbar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white flex items-center justify-between px-4 z-30 md:hidden">
        <button
          onClick={toggleMobileMenu}
          className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold">Stepease</span>
        </div>

        {/* Spacer for symmetry */}
        <div className="w-10" />
      </header>

      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={toggleSidebar}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={closeMobileMenu}
      />

      <main
        className={cn(
          "transition-all duration-300 ease-in-out",
          fullHeight ? "h-screen overflow-hidden" : "min-h-screen",
          // Mobile: add top padding for navbar, no side margin
          isMobile ? "pt-16 ml-0" : isCollapsed ? "ml-20" : "ml-64"
        )}
      >
        {children}
      </main>
    </div>
  )
}
