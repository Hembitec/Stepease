"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, CheckCircle, Info, Mic, FileText, Sparkles } from "lucide-react"
import { Bricolage_Grotesque } from "next/font/google"

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] })

const stats = [
  { value: "47,892", label: "SOPs created" },
  { value: "9 min", label: "average" },
  { value: "$0", label: "to start" },
]

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative pt-20 pb-16 lg:pt-24 lg:pb-20 px-4 overflow-hidden">
      {/* Background Patterns Layered */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Base Layer: Elegant Topographic Lines */}
        <div className="absolute inset-0 opacity-[0.12] invert dark:invert-0 dark:opacity-[0.05]">
          <Image
            src="/hero-bg-silent.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        
        {/* Overlay Layer: Subtle Dot Matrix */}
        <div className="absolute inset-0 opacity-[0.10] invert dark:invert-0 dark:opacity-[0.03]">
          <Image
            src="/hero-bg-dots.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div
            className={`lg:col-span-8 text-center lg:text-left transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {/* Callout Badge */}
            <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-5 border border-slate-200 dark:border-slate-700 max-w-[calc(100vw-2rem)]">
              <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-blue-600 flex-shrink-0"></span>
              <span className="truncate">Your team&apos;s knowledge lives in people&apos;s heads. That&apos;s a risk.</span>
            </div>

            {/* Headline */}
            <h1 className={`${bricolage.className} text-4xl sm:text-5xl lg:text-[5.5rem] font-bold text-foreground tracking-tight leading-[0.95] mb-4`}>
              Stop explaining things
              <br />
              <span className="text-blue-600 dark:text-blue-500">over and over.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-6">
              Describe your process out loud. Get a polished, audit-ready SOP in under 10 minutes.
            </p>

            {/* Inline Stats Proof */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 text-sm font-medium text-muted-foreground mb-6">
              {stats.map((stat, index) => (
                <span key={stat.label} className="flex items-center whitespace-nowrap">
                  <span className="text-foreground font-semibold">{stat.value}</span>
                  <span className="ml-1">{stat.label}</span>
                  {index < stats.length - 1 && (
                    <span className="w-1 h-1 rounded-full bg-border mx-2 hidden sm:inline" />
                  )}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-5">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-foreground hover:bg-foreground/90 text-background px-4 sm:px-8 h-14 text-base sm:text-lg font-medium rounded-xl whitespace-nowrap"
                >
                  Build Your First SOP Free
                  <ArrowRight className="w-5 h-5 ml-2 flex-shrink-0" />
                </Button>
              </Link>
              <Link href="#demo" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full sm:w-auto px-8 h-14 text-lg font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch It Work
                </Button>
              </Link>
            </div>

            {/* Micro-copy */}
            <p className="text-sm text-muted-foreground flex items-center justify-center lg:justify-start gap-6 flex-wrap">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-500/80" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-500/80" />
                Free forever
              </span>
            </p>
          </div>
          
          {/* Abstract UI Representation on the right */}
          <div className="hidden lg:block lg:col-span-4 relative h-full min-h-[500px]">
            {/* Main Document Graphic */}
            <div className={`absolute top-1/2 -translate-y-1/2 right-4 w-full max-w-[360px] z-0 transition-all duration-[1200ms] delay-300 ease-out ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
              <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                {/* Fake UI Header */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-sm bg-blue-600"></div>
                  </div>
                  <div>
                    <div className="h-2.5 w-24 bg-slate-200 dark:bg-slate-700 rounded-full mb-2.5"></div>
                    <div className="h-1.5 w-16 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                  </div>
                </div>
                
                {/* Fake UI List Items */}
                <div className="space-y-5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {i < 3 ? (
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-200 dark:border-slate-700"></div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2.5 py-1">
                        <div className={`h-2 bg-slate-200 dark:bg-slate-700 rounded-full ${i === 1 ? 'w-full' : i === 2 ? 'w-11/12' : 'w-10/12'}`}></div>
                        <div className={`h-2 bg-slate-100 dark:bg-slate-800 rounded-full ${i === 1 ? 'w-4/5' : i === 2 ? 'w-3/4' : 'w-1/2'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Fake UI Button */}
                <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800">
                  <div className="h-10 w-full bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700"></div>
                </div>
              </div>
            </div>

            {/* Overlapping AI Analysis Graphic */}
            <div className={`absolute top-1/2 -translate-y-1/2 left-0 -translate-x-12 translate-y-24 w-72 z-10 transition-all duration-[1200ms] delay-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}>
              <div className="w-full bg-slate-900 dark:bg-slate-950 border border-slate-800 dark:border-slate-800 rounded-2xl shadow-2xl p-5 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-start gap-4">
                  <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 mt-1">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-xl animate-pulse"></div>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-sm font-semibold mb-1">legacy_process.pdf</div>
                    <div className="text-blue-400 text-xs font-medium mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Analyzing structure...
                    </div>
                    
                    {/* Fake Progress Bars for Analysis Metrics */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1.5 uppercase font-semibold tracking-wider">
                          <span>Clarity Score</span>
                          <span className={`transition-opacity duration-1000 delay-[2000ms] ${isVisible ? "opacity-100" : "opacity-0"}`}>40/100</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full bg-amber-500 rounded-full transition-all duration-[1500ms] delay-[1200ms] ease-out ${isVisible ? "w-2/5" : "w-0"}`}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1.5 uppercase font-semibold tracking-wider">
                          <span>Safety Gaps</span>
                          <span className="text-blue-400 animate-pulse">Scanning...</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className={`relative h-full bg-blue-500 rounded-full transition-all duration-[2000ms] delay-[1500ms] ease-out ${isVisible ? "w-3/4" : "w-0"}`}>
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}