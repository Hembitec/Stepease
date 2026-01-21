"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface SidebarContextType {
    isCollapsed: boolean
    isMobileOpen: boolean
    isMobile: boolean
    toggleSidebar: () => void
    toggleMobileMenu: () => void
    closeMobileMenu: () => void
    setIsMobileMenuOpen: (isOpen: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
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
        <SidebarContext.Provider
            value={{
                isCollapsed,
                isMobileOpen: isMobileMenuOpen,
                isMobile,
                toggleSidebar,
                toggleMobileMenu,
                closeMobileMenu,
                setIsMobileMenuOpen,
            }}
        >
            {children}
        </SidebarContext.Provider>
    )
}

export function useSidebar() {
    const context = useContext(SidebarContext)
    if (context === undefined) {
        throw new Error("useSidebar must be used within a SidebarProvider")
    }
    return context
}
