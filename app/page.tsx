"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { PricingSection } from "@/components/pricing"
import { Button } from "@/components/ui/button"
import {
  Bot,
  Upload,
  Download,
  FileText,
  GitBranch,
  CheckCircle,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Eye,
  Zap,
  Users,
  Clock,
  Shield,
  Building2,
  ChevronDown,
  Play,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { DemoShowcase } from "@/components/landing/demo-showcase"
import { HeroSection } from "@/components/hero/hero-section"
import { useCountUp } from "@/components/landing/count-up"

const features = [
  {
    icon: Bot,
    title: "Just Talk, We'll Write",
    description:
      "Describe your process like you'd explain it to a colleague. AI captures every detail so you never miss a critical step.",
  },
  {
    icon: Upload,
    title: "Fix Outdated Docs Fast",
    description:
      "Drop your old SOPs and get actionable fixes in minutes so outdated documentation becomes your best one.",
  },
  {
    icon: Download,
    title: "Universal Export",
    description: "One click to PDF, Word, or Markdown. Easily paste into Notion, Confluence, or SharePoint.",
  },
  {
    icon: FileText,
    title: "Activity & Version Control",
    description: "Every action is logged. Revise an approved SOP, provide a reason, and auto-generate linked versions seamlessly.",
  },
  {
    icon: GitBranch,
    title: "Chat-Based Revisions",
    description: "Don't rewrite documents manually. Reopen an approved SOP, tell the AI what changed, and let it update the exact steps for you.",
  },
  {
    icon: Shield,
    title: "Public Viewing & Sharing",
    description: "Generate secure, read-only links to share your final procedures with team members instantly.",
  },
]

const steps = [
  {
    number: "01",
    title: "Context",
    subtitle: "Define your goal",
    description: "Tell the AI who the SOP is for and what it should achieve. Set the stage for success.",
    icon: MessageSquare,
  },
  {
    number: "02",
    title: "Interview",
    subtitle: "Answer smart questions",
    description: "The AI conducts a structured interview to extract every step, role, and troubleshooting tip.",
    icon: Bot,
  },
  {
    number: "03",
    title: "Review",
    subtitle: "Verify the logic",
    description: "See structured notes in real-time. The AI highlights gaps before writing a single word.",
    icon: Eye,
  },
  {
    number: "04",
    title: "Generate",
    subtitle: "Instant Documentation",
    description: "One click transforms your structured notes into a polished, professional PDF or Word doc.",
    icon: Sparkles,
  },
]

// Stats with proper structure for animation
const statsData = [
  { prefix: "<", value: 10, suffix: " min", label: "Average SOP creation", isTime: true },
  { prefix: "", value: 12, suffix: "+ hrs", label: "Saved per document", isTime: true },
  { prefix: "", value: 500, suffix: "+", label: "Teams trust us", isTime: false },
  { prefix: "", value: 50000, suffix: "+", label: "SOPs created", isTime: false },
]

// Animated stat component with count-up
interface StatData {
  prefix: string
  value: number
  suffix: string
  label: string
  isTime: boolean
}

function AnimatedStat({ stat, className, labelClassName }: { stat: StatData; className?: string; labelClassName?: string }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const countValue = useCountUp({ end: stat.value, duration: 2000, prefix: stat.prefix, suffix: stat.suffix, enabled: isVisible })

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="text-center">
      <div className={cn("font-bold text-slate-900", className)}>{countValue}</div>
      <div className={cn("text-slate-600", labelClassName)}>{stat.label}</div>
    </div>
  )
}

const testimonials = [
  {
    quote:
      "We were spending weeks on SOPs that now take under an hour. The AI asks better questions than our consultants did.",
    author: "Sarah Chen",
    role: "VP of Operations",
    department: "Fintech",
    teamSize: "40-person team",
    location: "Austin",
    outcome: "Weeks → Under 1 hour",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=96&h=96&fit=crop&crop=face",
  },
  {
    quote: "Finally, onboarding docs people actually use. New hires get up to speed in days instead of weeks, and I stop getting the same Slack questions.",
    author: "Marcus Williams",
    role: "Quality Assurance Lead",
    department: "Healthcare",
    teamSize: "Clinical operations",
    location: "Chicago",
    outcome: "Days instead of weeks",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face",
  },
  {
    quote: "Standardizing our compliance procedures used to be a nightmare. Stepease helped us build a central source of truth that our entire team actually follows.",
    author: "Elena Rodriguez",
    role: "Compliance Director",
    department: "Financial services",
    teamSize: "Mid-size firm",
    location: "Miami",
    outcome: "100% policy adoption",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=96&h=96&fit=crop&crop=face",
  },
]

const useCases = [
  {
    icon: Building2,
    title: "Operations Teams",
    description: "Standardize workflows across departments and locations.",
  },
  {
    icon: Shield,
    title: "Compliance & Quality",
    description: "Meet audit requirements with properly documented procedures.",
  },
  {
    icon: Users,
    title: "HR & Training",
    description: "Create onboarding materials that scale with your team.",
  },
  {
    icon: Clock,
    title: "IT & Security",
    description: "Document incident response and security protocols.",
  },
]

const faqs = [
  {
    category: "Getting Started",
    q: "How long does it take to create an SOP?",
    a: "Most users complete their first SOP in under 10 minutes. The AI asks targeted questions about your process, extracts the key details, and formats everything into a professional document. No staring at blank pages.",
  },
  {
    category: "Getting Started",
    q: "Can I import my existing documents?",
    a: "Yes. Upload PDFs, Word docs, or plain text. The AI reviews what you have, identifies gaps or outdated steps, and suggests improvements. You keep what works, fix what doesn't.",
  },
  {
    category: "Features",
    q: "What export formats are available?",
    a: "PDF for sharing, Word (.docx) for editing, Markdown for technical teams, and HTML for web publishing. Copy and paste works great too if you use Confluence, Notion, or SharePoint.",
  },
  {
    category: "Features",
    q: "How does the revision workflow work?",
    a: "Once an SOP is approved, it is locked. Need changes? Reopen it, tell the AI what changed (new tool, new step, new person), and it updates the document. Every revision is tracked with a reason and timestamp.",
  },
  {
    category: "Security",
    q: "Is my data secure?",
    a: "All data is encrypted at rest and in transit. We use industry-standard security practices and your documents are private to your workspace. We do not train AI models on your content.",
  },
  {
    category: "Billing",
    q: "Can I change plans or cancel anytime?",
    a: "Yes. Upgrade, downgrade, or cancel whenever you need. If you downgrade, your existing SOPs remain accessible. We will never lock you out of your own work.",
  },
  {
    category: "Billing",
    q: "What happens when I hit my monthly limit?",
    a: "On the Free plan, you will need to wait until next month or upgrade. Paid plans give you a clear monthly allowance. We will warn you at 80% so there are no surprises.",
  },
]

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero Section - Minimal & Editorial */}
      <HeroSection />

      {/* Stats Section - Asymmetric layout with animated count-up */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Left column - Primary stats (time ratio story) */}
            <div className="space-y-4 md:space-y-6">
              {/* Mobile: Side by side with arrow | Desktop: Row layout */}
              <div className="flex items-center gap-3 sm:gap-3">
                <div className="flex-1">
                  <AnimatedStat stat={statsData[0]} className="text-3xl sm:text-4xl lg:text-6xl" />
                </div>
                <div className="flex flex-col items-center px-2 sm:px-3">
                  <span className="text-slate-400 text-lg sm:text-xl">→</span>
                  <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wide">saves</span>
                </div>
                <div className="flex-1">
                  <AnimatedStat stat={statsData[1]} className="text-2xl sm:text-3xl lg:text-5xl text-slate-600" />
                </div>
              </div>
              <p className="text-sm text-slate-500">Average time to create vs. time saved per SOP</p>
            </div>
            {/* Right column - Scale stats */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:pl-8 md:border-l border-slate-200 pt-6 md:pt-0 border-t md:border-t-0">
              <AnimatedStat stat={statsData[2]} className="text-2xl sm:text-3xl lg:text-4xl" labelClassName="text-sm" />
              <AnimatedStat stat={statsData[3]} className="text-2xl sm:text-3xl lg:text-4xl" labelClassName="text-sm" />
            </div>
          </div>
          {/* Trust bar */}
          <div className="mt-10 md:mt-12 pt-6 md:pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-sm text-slate-500">
            <span className="whitespace-nowrap">Trusted by ops teams at</span>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
              {["fintech", "healthcare", "logistics", "manufacturing"].map((industry) => (
                <span key={industry} className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 capitalize whitespace-nowrap">
                  {industry}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Staggered layout with dividing lines */}
      <section id="features" className="py-24 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Why teams switch
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Less writing. Less rewriting. More doing.
            </p>
          </div>

          {/* Mobile: Stack with horizontal dividers | Desktop: Grid with vertical dividers */}
          <div className="border-t border-slate-200">
            {/* Row 1 */}
            {features.slice(0, 3).map((feature, index) => (
              <div
                key={index}
                className={cn(
                  "py-6 md:py-8 border-b border-slate-200",
                  "md:float-left md:w-1/3 md:py-8",
                  index < 2 && "md:border-r md:border-b-0",
                  index > 0 && "md:pl-6 lg:pl-8"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="md:clear-both" />

            {/* Row 2 - Offset on desktop */}
            <div className="md:ml-16 lg:ml-24">
              {features.slice(3, 6).map((feature, index) => (
                <div
                  key={index}
                  className={cn(
                    "py-6 md:py-8 border-b border-slate-200 last:border-b-0",
                    "md:float-left md:w-1/3 md:py-8",
                    index < 2 && "md:border-r",
                    index > 0 && "md:pl-6 lg:pl-8"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="md:clear-both" />
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="py-24 px-4 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-slate-500 font-medium mb-3 text-sm uppercase tracking-wide">
              Interactive preview
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              From your words to a finished document
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
              Watch Stepease conduct a structured interview and build a complete SOP — with extracted notes, assigned roles, and export-ready formatting.
            </p>
          </div>

          <DemoShowcase />
        </div>
      </section>

      {/* How It Works Section - Compact 2x2 grid */}
      <section id="how-it-works" className="py-24 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              How it works
            </h2>
            <p className="text-lg text-slate-600 max-w-xl">
              Four steps. Five minutes. One perfect document.
            </p>
          </div>

          {/* Compact 2x2 grid with connecting lines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden">
            {steps.map((step, index) => (
              <div key={index} className="bg-white p-6 lg:p-8">
                <div className="flex items-start gap-4">
                  {/* Step number - blue */}
                  <span className="text-2xl font-bold text-blue-600 w-12 flex-shrink-0">
                    {step.number}
                  </span>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-500">
                      <step.icon className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-wide font-medium">
                        {step.subtitle}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section - Asymmetric 2x2 instead of identical grid */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: Heading */}
            <div className="lg:sticky lg:top-32 lg:self-start">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                Built for ops teams
              </h2>
              <p className="text-lg text-slate-600">
                Whether you're documenting security protocols or onboarding workflows, Stepease fits how you actually work.
              </p>
            </div>

            {/* Right: Use cases as simple list */}
            <div className="space-y-8">
              {useCases.map((useCase, index) => (
                <div key={index} className="flex gap-4 pb-8 border-b border-slate-100 last:border-0">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <useCase.icon className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{useCase.title}</h3>
                    <p className="text-slate-600 text-sm">{useCase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Grid layout, all visible, light theme */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-slate-500 font-semibold mb-4 tracking-wide uppercase text-sm">Customer stories</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">Loved by operations teams</h2>
          </div>

          {/* 3-column grid - all testimonials visible */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Outcome badge */}
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full mb-4">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  {testimonial.outcome}
                </div>

                {/* Quote */}
                <p className="text-slate-700 leading-relaxed mb-6 text-[15px]">
                  "{testimonial.quote}"
                </p>

                {/* Author info with Unsplash photo */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover bg-slate-100"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 text-sm">{testimonial.author}</div>
                    <div className="text-slate-500 text-xs">
                      {testimonial.role}
                    </div>
                    <div className="text-slate-400 text-xs">
                      {testimonial.department} · {testimonial.teamSize} · {testimonial.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 bg-slate-50">
        <PricingSection />
      </section>

      {/* FAQ Section - Categorized with CTA */}
      <section id="faq" className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Frequently asked questions
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to know. Cannot find what you are looking for? Reach out to us.
            </p>
          </div>

          {/* FAQ Grid - 2 columns on desktop */}
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left bg-white hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">
                      {faq.category}
                    </span>
                    <span className="block font-semibold text-slate-900 mt-1">{faq.q}</span>
                  </div>
                  <ChevronDown
                    className={cn("w-5 h-5 text-slate-400 flex-shrink-0 ml-4 transition-transform", openFaq === index && "rotate-180")}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-4 text-slate-600 bg-slate-50 text-sm leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Still have questions CTA */}
          <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Still have questions?</h3>
                <p className="text-sm text-slate-600">
                  Our team typically responds within a few hours.
                </p>
              </div>
              <Link href="mailto:hello@stepease.app">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  Send us an email
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 lg:py-24 px-4 overflow-hidden bg-slate-900 border-b border-slate-800">
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
        {/* Ambient glow shapes */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Social proof avatars - always inline */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex -space-x-3 flex-shrink-0">
              {[
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face",
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="w-8 sm:w-10 h-8 sm:h-10 rounded-full border-2 border-slate-900/50 object-cover bg-slate-800"
                  loading="lazy"
                />
              ))}
            </div>
            <span className="text-sm text-slate-400 whitespace-nowrap">
              <span className="text-white font-semibold">500+</span> ops teams
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Stop explaining. Start documenting.
          </h2>
          <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Turn tribal knowledge into structured SOPs your team will actually use. Built for operations teams who are tired of answering the same questions twice.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 px-8 h-12 text-base font-semibold shadow-lg shadow-blue-600/25">
                Create your first SOP free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 px-8 h-12 text-base backdrop-blur-sm transition-all"
              >
                See how it works
              </Button>
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-6 mt-8 text-slate-500 text-sm flex-wrap">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Free forever tier
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Setup in 2 minutes
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
