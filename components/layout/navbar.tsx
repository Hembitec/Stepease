"use client"

import Link from "next/link"
import { useState, useEffect, useRef, useCallback } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from "@clerk/nextjs"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#demo", label: "Demo" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
]

export function Navbar() {
  const [scrollY, setScrollY] = useState(0)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Track scroll position for graduated background
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Scrollspy with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    )

    navLinks.forEach(({ href }) => {
      const element = document.querySelector(href)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  // Close mobile menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }
    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobileMenuOpen])

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [])

  // Graduated scroll background: 0-50px transparent, 50-150px translucent, 150px+ solid
  const navClasses = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
    scrollY < 50 && "bg-transparent",
    scrollY >= 50 && scrollY < 150 && "bg-white/50 backdrop-blur-sm",
    scrollY >= 150 && "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100"
  )

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - no bracket gimmick */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-semibold text-slate-900 tracking-tight">
              StepEase
            </span>
          </Link>

          {/* Desktop Navigation with scrollspy */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => {
              const isActive = activeSection === href.replace("#", "")
              return (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  className={cn(
                    "relative px-3 py-2 text-sm transition-colors duration-200",
                    isActive ? "text-slate-900 font-medium" : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-slate-900 rounded-full" />
                  )}
                </a>
              )
            })}
          </div>

          {/* Desktop CTA - Restyled auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                  Log In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white px-5">
                  Get Started
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white px-5">
                  Dashboard
                </Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu with animation */}
      <div
        ref={mobileMenuRef}
        className={cn(
          "md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-lg transition-all duration-300 ease-out",
          isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        )}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => handleNavClick(e, href)}
              className={cn(
                "block px-3 py-2.5 rounded-lg text-sm transition-colors",
                activeSection === href.replace("#", "")
                  ? "bg-slate-100 text-slate-900 font-medium"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {label}
            </a>
          ))}
          <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
            <SignedOut>
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <Button variant="ghost" className="w-full justify-start text-slate-600">
                  Log In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                  Get Started
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="block">
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                  Dashboard
                </Button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </div>

      {/* Backdrop overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 top-16 bg-black/20 z-[-1]"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  )
}
