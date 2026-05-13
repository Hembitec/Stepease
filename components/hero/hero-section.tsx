"use client"

import Link from "next/link"
import { ArrowRight, Bot, CheckCircle, Layers3, Mic, Play, Sparkles } from "lucide-react"
import { Bricolage_Grotesque } from "next/font/google"
import { Button } from "@/components/ui/button"

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] })

const proofPoints = [
  { value: "47,892", label: "SOPs created" },
  { value: "9 min", label: "average first draft" },
  { value: "$0", label: "to start" },
]

const categoryDots = [
  "bg-orange-500 hero-cat-1",
  "bg-emerald-500 hero-cat-2",
  "bg-cyan-600 hero-cat-3",
  "bg-slate-200",
  "bg-slate-200",
  "bg-slate-200",
  "bg-slate-200",
  "bg-slate-200",
  "bg-slate-200",
  "bg-slate-200",
  "bg-slate-200",
  "bg-slate-200",
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 pb-12 sm:pt-20 lg:pt-24 lg:pb-16">
      <div className="hero-ambient pointer-events-none absolute inset-0" />
      <div className="hero-dot-matrix pointer-events-none absolute inset-0 opacity-35" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(248,250,252,0)_0%,rgba(248,250,252,0)_52%,rgba(239,246,255,0.78)_100%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 py-8 sm:py-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 lg:py-14 xl:gap-16">
          <div className="max-w-[34rem]">
                <div className="inline-flex max-w-[18.75rem] items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[10px] font-medium leading-none text-slate-700 sm:max-w-full sm:gap-2 sm:px-3 sm:py-1.5 sm:text-sm">
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600 sm:h-2 sm:w-2" />
                  <span className="truncate">Your team&apos;s knowledge lives in people&apos;s heads. That&apos;s a risk.</span>
                </div>

                <h1
                  className={`${bricolage.className} mt-4 text-[2.55rem] font-bold tracking-tight leading-[0.97] text-slate-900 sm:mt-5 sm:text-6xl lg:text-7xl lg:leading-[0.95]`}
                >
                  Stop explaining things
                  <br />
                  <span className="text-blue-600">over and over.</span>
                </h1>

                <p className="mt-4 max-w-xl text-[1.12rem] leading-relaxed text-slate-600 sm:mt-5 sm:text-xl">
                  Describe your process out loud. Get a polished, audit-ready SOP in under 10 minutes.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link href="/dashboard" className="w-full sm:w-auto">
                    <Button className="h-14 w-full rounded-xl bg-slate-900 px-7 text-base font-medium text-white hover:bg-slate-800 sm:w-auto">
                      Build Your First SOP Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="#demo" className="w-full sm:w-auto">
                    <Button
                      variant="ghost"
                      className="h-14 w-full rounded-xl px-7 text-base font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 sm:w-auto"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Watch It Work
                    </Button>
                  </Link>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-slate-500">
                  {proofPoints.map((point, index) => (
                    <span key={point.label} className="flex items-center whitespace-nowrap">
                      <span className="font-semibold text-slate-900">{point.value}</span>
                      <span className="ml-1">{point.label}</span>
                      {index < proofPoints.length - 1 ? (
                        <span className="mx-2 hidden h-1 w-1 rounded-full bg-slate-300 sm:inline-block" />
                      ) : null}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    No credit card required
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Free forever
                  </span>
                </div>
          </div>

          <div className="min-w-0 lg:pt-2">
            <div className="hidden lg:block">
              <HeroDesktopGraphic />
            </div>
            <div className="lg:hidden">
              <HeroMobileGraphic />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-ambient {
          background:
            radial-gradient(ellipse 60% 52% at 84% 46%, rgba(59, 130, 246, 0.08), transparent 70%),
            radial-gradient(ellipse 58% 46% at 16% 44%, rgba(99, 102, 241, 0.06), transparent 72%);
        }
        .hero-dot-matrix {
          background-image: radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.06) 1px, transparent 0);
          background-size: 22px 22px;
        }
        .hero-bubble-user {
          animation: hero-bubble-in 0.55s ease-out 0.2s both;
        }
        .hero-bubble-ai {
          animation: hero-bubble-in 0.55s ease-out 1.15s both;
        }
        .hero-note-primary {
          animation: hero-note-enter 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 1.8s both;
        }
        .hero-note-secondary {
          animation: hero-note-enter-soft 0.7s ease-out 2.35s both;
        }
        .hero-note-tertiary {
          animation: hero-note-enter-soft 0.7s ease-out 2.95s both;
        }
        .hero-phrase-1 {
          animation: hero-phrase-highlight 1.4s ease-out 1.55s both;
        }
        .hero-phrase-2 {
          animation: hero-phrase-highlight 1.4s ease-out 2.15s both;
        }
        .hero-connector-1 {
          stroke-dasharray: 300;
          animation: hero-connector-draw 1.1s ease-out 1.7s both;
        }
        .hero-connector-2 {
          stroke-dasharray: 300;
          animation: hero-connector-draw 1.15s ease-out 2.25s both;
        }
        .hero-pulse {
          animation: hero-pulse-soft 1.8s ease-in-out infinite;
        }
        .hero-typing-1 {
          animation: hero-typing-dot 1.2s ease-in-out infinite 0s;
        }
        .hero-typing-2 {
          animation: hero-typing-dot 1.2s ease-in-out infinite 0.15s;
        }
        .hero-typing-3 {
          animation: hero-typing-dot 1.2s ease-in-out infinite 0.3s;
        }
        .hero-caret {
          animation: hero-caret-blink 0.9s ease-in-out infinite;
        }
        .hero-wave-1 {
          animation: hero-wave 1.1s ease-in-out infinite 0s;
        }
        .hero-wave-2 {
          animation: hero-wave 1.1s ease-in-out infinite 0.1s;
        }
        .hero-wave-3 {
          animation: hero-wave 1.1s ease-in-out infinite 0.2s;
        }
        .hero-wave-4 {
          animation: hero-wave 1.1s ease-in-out infinite 0.3s;
        }
        .hero-wave-5 {
          animation: hero-wave 1.1s ease-in-out infinite 0.15s;
        }
        .hero-sparkle {
          animation: hero-sparkle 2.2s ease-in-out infinite 2s;
        }
        .hero-cat-1 {
          animation: hero-cat-fill-orange 0.6s ease-out 1.9s both;
        }
        .hero-cat-2 {
          animation: hero-cat-fill-green 0.6s ease-out 2.5s both;
        }
        .hero-cat-3 {
          animation: hero-cat-fill-cyan 0.6s ease-out 3.1s both;
        }

        @keyframes hero-bubble-in {
          0% {
            opacity: 0;
            transform: translateY(6px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes hero-note-enter {
          0% {
            opacity: 0;
            transform: translateX(14px) scale(0.94);
            filter: blur(6px);
            box-shadow: 0 0 0 rgba(59, 130, 246, 0);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
            filter: blur(0);
            box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.08), 0 20px 40px -24px rgba(59, 130, 246, 0.5);
          }
        }
        @keyframes hero-note-enter-soft {
          0% {
            opacity: 0;
            transform: translateX(14px) scale(0.96);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
            filter: blur(0);
          }
        }
        @keyframes hero-phrase-highlight {
          0%,
          60% {
            background-color: transparent;
          }
          70% {
            background-color: rgba(251, 146, 60, 0.3);
          }
          100% {
            background-color: rgba(251, 146, 60, 0.18);
          }
        }
        @keyframes hero-connector-draw {
          0% {
            stroke-dashoffset: 300;
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 0.6;
          }
        }
        @keyframes hero-pulse-soft {
          0%,
          100% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.04);
          }
        }
        @keyframes hero-typing-dot {
          0%,
          60%,
          100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          30% {
            opacity: 1;
            transform: translateY(-2px);
          }
        }
        @keyframes hero-caret-blink {
          0%,
          49% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0;
          }
        }
        @keyframes hero-wave {
          0%,
          100% {
            transform: scaleY(0.4);
          }
          50% {
            transform: scaleY(1);
          }
        }
        @keyframes hero-sparkle {
          0%,
          100% {
            opacity: 0;
            transform: scale(0.5) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }
        @keyframes hero-cat-fill-orange {
          0% {
            background-color: rgb(226 232 240);
            transform: scale(1);
          }
          50% {
            transform: scale(1.4);
          }
          100% {
            background-color: rgb(249 115 22);
            transform: scale(1);
          }
        }
        @keyframes hero-cat-fill-green {
          0% {
            background-color: rgb(226 232 240);
            transform: scale(1);
          }
          50% {
            transform: scale(1.4);
          }
          100% {
            background-color: rgb(34 197 94);
            transform: scale(1);
          }
        }
        @keyframes hero-cat-fill-cyan {
          0% {
            background-color: rgb(226 232 240);
            transform: scale(1);
          }
          50% {
            transform: scale(1.4);
          }
          100% {
            background-color: rgb(8 145 178);
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  )
}

function HeroDesktopGraphic() {
  return (
    <div className="relative min-h-[540px]">
      <div className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-6 rounded-full bg-emerald-500" />
              <span className="hero-pulse h-1.5 w-8 rounded-full bg-blue-600" />
              <span className="h-1.5 w-5 rounded-full bg-slate-200" />
              <span className="h-1.5 w-5 rounded-full bg-slate-200" />
              <span className="h-1.5 w-5 rounded-full bg-slate-200" />
            </div>
            <span className="text-xs font-semibold text-slate-700">Process Discovery</span>
            <span className="font-mono text-xs tabular-nums text-slate-400">35%</span>
          </div>

          <div className="flex min-w-0 items-center gap-2">
            <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">
              Categories
            </span>
            <div className="flex items-center gap-1">
              {categoryDots.map((className, index) => (
                <span key={index} className={`h-1.5 w-1.5 rounded-full ${className}`} />
              ))}
            </div>
            <span className="whitespace-nowrap font-mono text-[11px] font-semibold tabular-nums text-slate-600">3/12</span>
          </div>
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-[1fr_auto_1.08fr] items-start gap-0">
        <div className="space-y-3 pr-2">
          <div className="mb-1 flex items-center justify-between">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Conversation</div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <span className="h-1 w-1 rounded-full bg-emerald-500" />
              <span>active</span>
            </div>
          </div>

          <div className="hero-bubble-user">
            <div className="flex items-start justify-end gap-2">
              <div className="flex max-w-[92%] flex-col items-end gap-1">
                <div className="rounded-2xl rounded-tr-sm bg-blue-600 px-3.5 py-2.5 text-[13px] leading-relaxed text-white shadow-sm">
                  So after the invoice arrives by email, the{" "}
                  <span className="hero-phrase-1 rounded-[3px] px-[3px] font-medium">
                    AP clerk logs it in our tracking system
                  </span>
                  . Then we verify vendor details and{" "}
                  <span className="hero-phrase-2 rounded-[3px] px-[3px] font-medium">
                    route it based on amount
                  </span>
                  .
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                  <div className="flex h-2 items-center gap-[1px]">
                    <span className="hero-wave-1 h-full w-[1.5px] rounded-full bg-slate-400" />
                    <span className="hero-wave-2 h-full w-[1.5px] rounded-full bg-slate-400" />
                    <span className="hero-wave-3 h-full w-[1.5px] rounded-full bg-slate-400" />
                    <span className="hero-wave-4 h-full w-[1.5px] rounded-full bg-slate-400" />
                    <span className="hero-wave-5 h-full w-[1.5px] rounded-full bg-slate-400" />
                  </div>
                  <span>Voice · 4s ago</span>
                </div>
              </div>

              <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-200">
                <Mic className="h-3.5 w-3.5 text-slate-500" />
              </div>
            </div>
          </div>

          <div className="hero-bubble-ai">
            <div className="flex items-start gap-2">
              <div className="relative mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-600">
                <Bot className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="flex max-w-[88%] flex-col gap-1">
                <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-3.5 py-2.5 text-[13px] leading-relaxed text-slate-800">
                  Got it. AP clerk logs and verifies. What are the amount thresholds for routing
                  <span className="hero-caret ml-0.5 inline-block h-[13px] w-[1.5px] translate-y-0.5 bg-slate-600" />
                </div>
                <div className="flex items-center gap-1.5 pl-1 font-mono text-[10px] text-slate-400">
                  <div className="flex items-center gap-0.5">
                    <span className="hero-typing-1 h-1 w-1 rounded-full bg-blue-500" />
                    <span className="hero-typing-2 h-1 w-1 rounded-full bg-blue-500" />
                    <span className="hero-typing-3 h-1 w-1 rounded-full bg-blue-500" />
                  </div>
                  <span>Stepease · typing</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative hidden w-10 self-stretch lg:block">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 40 400" fill="none" preserveAspectRatio="none">
            <path
              className="hero-connector-1"
              d="M 2 90 C 20 95, 22 135, 38 140"
              stroke="url(#hero-grad-1)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="4 4"
            />
            <path
              className="hero-connector-2"
              d="M 2 120 C 20 200, 22 245, 38 250"
              stroke="url(#hero-grad-2)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeDasharray="3 4"
              opacity="0.5"
            />
            <defs>
              <linearGradient id="hero-grad-1" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="rgb(251, 146, 60)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="rgb(234, 88, 12)" stopOpacity="0.5" />
              </linearGradient>
              <linearGradient id="hero-grad-2" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="rgb(251, 191, 36)" stopOpacity="0.7" />
                <stop offset="100%" stopColor="rgb(217, 119, 6)" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="relative space-y-2.5 pl-1">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Extracted Notes
            </div>
            <div className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 font-mono text-[10px] font-medium text-emerald-700">
              <span className="hero-pulse h-1 w-1 rounded-full bg-emerald-500" />
              Auto-extracting
            </div>
          </div>

          <div className="hero-note-primary relative rounded-xl border border-blue-200 bg-white p-3.5">
            <div className="absolute -top-2 -right-2 z-10">
              <div className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-md">
                <Sparkles className="hero-sparkle h-2.5 w-2.5" />
                Just extracted
              </div>
            </div>

            <div className="mb-2 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-orange-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-orange-700">
                <span className="h-1.5 w-1.5 rounded-sm bg-orange-500" />
                Procedure
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-600">
                <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
                HIGH
              </span>
            </div>
            <p className="text-[13px] font-medium leading-relaxed text-slate-800">
              Step 1: Receive invoice via email. Step 2: AP clerk logs invoice in the tracking system.
            </p>
            <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
              <span className="font-mono text-[10px] text-slate-500">
                <span className="text-slate-400">→</span> Section 7 · Procedure Steps
              </span>
              <span className="font-mono text-[10px] tabular-nums text-slate-400">now</span>
            </div>
          </div>

          <div className="hero-note-secondary rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:border-slate-300">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-sm bg-emerald-500" />
                Roles
              </span>
              <span className="text-[10px] font-semibold text-amber-600">MED</span>
            </div>
            <p className="text-xs leading-snug text-slate-700">
              Accounts Payable Clerk owns invoice intake, verification, and logging.
            </p>
            <div className="mt-1.5 font-mono text-[10px] text-slate-400">→ Section 4 · Roles</div>
          </div>

          <div className="hero-note-tertiary rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:border-slate-300">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-700">
                <span className="h-1.5 w-1.5 rounded-sm bg-amber-500" />
                Decision Points
              </span>
              <span className="text-[10px] font-semibold text-amber-600">MED</span>
            </div>
            <p className="text-xs leading-snug text-slate-700">Approval routing changes by invoice amount. Thresholds still needed.</p>
            <div className="mt-1.5 font-mono text-[10px] text-slate-400">→ Section 7.2 · Workflow</div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-3 py-2">
            <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-500">
              <Sparkles className="h-3 w-3 animate-spin" />
            </div>
            <span className="text-[11px] font-medium text-slate-500">Listening for next detail…</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-2">
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <Layers3 className="h-3.5 w-3.5 text-blue-500" />
          <span className="font-medium text-slate-700">12 categories</span>
          <span className="text-slate-400">·</span>
          <span>Auto-organized by priority</span>
        </div>
        <div className="font-mono text-[10px] tabular-nums text-slate-400">~6 min remaining</div>
      </div>
    </div>
  )
}

function HeroMobileGraphic() {
  return (
    <div className="mt-8 rounded-[1.75rem] bg-white/75 p-4 shadow-[0_30px_80px_-48px_rgba(15,23,42,0.35)] ring-1 ring-slate-200/80 backdrop-blur-sm sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <span className="h-1 w-4 rounded-full bg-emerald-500" />
            <span className="hero-pulse h-1 w-5 rounded-full bg-blue-600" />
            <span className="h-1 w-3 rounded-full bg-slate-200" />
            <span className="h-1 w-3 rounded-full bg-slate-200" />
            <span className="h-1 w-3 rounded-full bg-slate-200" />
          </div>
          <div className="mt-1 text-[11px] font-medium text-slate-600">Process Discovery</div>
        </div>
        <span className="font-mono text-[10px] text-slate-400">3/12 categories · 35%</span>
      </div>

      <div className="mt-4 grid gap-3">
        <div className="rounded-2xl bg-blue-600 p-3.5 text-white shadow-sm">
          <div className="mb-2 flex items-center justify-between text-[10px] font-mono text-blue-100">
            <span>Conversation</span>
            <span>Voice · 4s ago</span>
          </div>
          <p className="text-sm leading-relaxed">
            The AP clerk logs the invoice, verifies vendor details, then routes it by amount and approver level.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white/90 p-3.5">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-blue-600" />
              <span className="text-[11px] font-semibold text-slate-700">Stepease is extracting notes</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">typing</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-700">
            Got it. What are the routing thresholds and who approves each amount band?
          </p>
        </div>

        <div className="rounded-[1.4rem] border border-blue-200 bg-white p-3.5 shadow-[0_18px_40px_-28px_rgba(59,130,246,0.45)]">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-orange-100 px-1.5 py-0.5 text-[9px] font-semibold text-orange-700">
              <span className="h-1.5 w-1.5 rounded-sm bg-orange-500" />
              Procedure
            </span>
            <span className="text-[9px] font-bold text-red-600">HIGH</span>
          </div>
          <p className="text-sm leading-snug text-slate-800">
            Step 1: Receive invoice. Step 2: Log it in the tracking system. Step 3: Route it by amount threshold.
          </p>
          <div className="mt-3 border-t border-slate-100 pt-2 text-[10px] font-mono text-slate-400">
            → Section 7 · Procedure Steps
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">Roles</div>
            <p className="text-[11px] leading-snug text-slate-600">AP clerk owns intake, verification, and logging.</p>
          </div>
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700">Decision</div>
            <p className="text-[11px] leading-snug text-slate-500">Approval routing depends on amount thresholds.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
