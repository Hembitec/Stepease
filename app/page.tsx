"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
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
  Quote,
} from "lucide-react"
import { cn } from "@/lib/utils"

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
    title: "Smart Structure Detection",
    description: "AI automatically ensures you have all 12 essential SOP sections, from Scope to Troubleshooting.",
  },
  {
    icon: GitBranch,
    title: "Logic Mapping",
    description: "AI identifies and structures complex decision points so no conditional step is missed.",
  },
  {
    icon: Shield,
    title: "Compliance Assistant",
    description: "The AI proactively asks about safety risks and quality checks to ensure your SOP is robust.",
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

const stats = [
  { value: "<10 min", label: "Average SOP creation" },
  { value: "12+ hrs", label: "Saved per document" },
  { value: "500+", label: "Teams trust us" },
  { value: "47,892", label: "SOPs created" },
]

const testimonials = [
  {
    quote:
      "We reduced our SOP creation time from 3 weeks to 4 hours. The AI captured nuances our manual process always missed.",
    author: "Sarah Chen",
    role: "Head of Operations",
    company: "TechFlow Inc.",
  },
  {
    quote: "Our onboarding docs went from 'nobody reads these' to 'this is actually useful.' Game changer for our growing team.",
    author: "Marcus Johnson",
    role: "Quality Manager",
    company: "MediCare Solutions",
  },
  {
    quote: "Saved $15,000 in consulting fees for our SOC2 audit. The compliance templates paid for themselves 50x over.",
    author: "Elena Rodriguez",
    role: "Compliance Director",
    company: "FinServe Global",
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
    q: "How does the AI understand my specific industry?",
    a: "Our AI is trained on thousands of SOPs across industries including healthcare, manufacturing, finance, and tech. It adapts its suggestions based on your context and compliance needs.",
  },
  {
    q: "Can I import my existing SOPs?",
    a: "Yes! Upload PDFs, Word docs, or plain text. Our AI analyzes your existing documentation and suggests improvements while preserving your institutional knowledge.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. We use enterprise-grade encryption, are SOC2 compliant, and never train on your proprietary data. Your SOPs remain yours.",
  },
  {
    q: "What formats can I export to?",
    a: "Export to PDF, Word (.docx), Markdown, or HTML. You can easily copy content to paste into Confluence, Notion, or SharePoint.",
  },
]

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section - Premium with animated gradients */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Background Image - Option A: Abstract Flow */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-abstract.png"
            alt="Background"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/80 to-background dark:from-slate-950/50 dark:via-slate-950/80 dark:to-background" />
        </div>

        {/* Original gradients commented out for easy toggling
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-slate-50/50 to-background dark:from-blue-950/20 dark:via-slate-900/50" />
        <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-indigo-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        */}

        <div className="relative max-w-5xl mx-auto text-center">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm hover:bg-blue-600/15 transition-colors">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Stop writing SOPs manually
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-[1.1] tracking-tight">
              Build Professional SOPs
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
                in Minutes, Not Weeks
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              Tell AI about your process like you'd explain it to a colleague. Get a polished, compliance-ready SOP in under 10 minutes. <span className="font-medium text-foreground">Trusted by 500+ operations teams.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 h-14 text-lg gap-2 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transition-all hover:scale-[1.02]"
                >
                  Create Your First SOP Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 h-14 text-lg gap-2 bg-background/80 border-border hover:bg-accent backdrop-blur-sm"
                >
                  <Play className="w-5 h-5" />
                  See It In Action
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground mt-6 flex items-center justify-center gap-4 flex-wrap">
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> No credit card required</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Free forever tier</span>
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-slate-900 mb-2">{stat.value}</div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-600 dark:text-blue-400 font-semibold mb-4 tracking-wide uppercase text-sm">Why Teams Switch to Stepease</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Your Documentation, Finally Done Right
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to eliminate documentation debt. Nothing you don't.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl border border-border bg-card hover:border-blue-200 dark:hover:border-blue-900 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-indigo-100 dark:group-hover:from-blue-900 dark:group-hover:to-indigo-900 transition-all">
                  <feature.icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold mb-4 tracking-wide uppercase text-sm">Process</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Four steps to perfect documentation
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From conversation to professional SOP in minutes, not days.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 h-full border border-slate-100 hover:shadow-lg transition-shadow">
                  <div className="text-5xl font-bold text-slate-100 mb-4">{step.number}</div>
                  <step.icon className="w-8 h-8 text-blue-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-blue-600 font-medium mb-3">{step.subtitle}</p>
                  <p className="text-slate-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-6 text-slate-300">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold mb-4 tracking-wide uppercase text-sm">Use Cases</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">Built for every team</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From startups to enterprises, teams trust Stepease for critical documentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <div key={index} className="text-center p-8 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <useCase.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{useCase.title}</h3>
                <p className="text-slate-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-400 font-semibold mb-4 tracking-wide uppercase text-sm">Testimonials</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Loved by operations teams</h2>
          </div>

          <div className="relative">
            <Quote className="absolute -top-4 -left-4 w-16 h-16 text-slate-800" />
            <div className="bg-slate-800/50 rounded-2xl p-8 md:p-12 border border-slate-700">
              <p className="text-xl md:text-2xl text-slate-200 mb-8 leading-relaxed">
                "{testimonials[activeTestimonial].quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonials[activeTestimonial].author.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonials[activeTestimonial].author}</div>
                  <div className="text-slate-400 text-sm">
                    {testimonials[activeTestimonial].role}, {testimonials[activeTestimonial].company}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    index === activeTestimonial ? "bg-blue-500 w-8" : "bg-slate-600 hover:bg-slate-500",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 bg-slate-50">
        <PricingSection />
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold mb-4 tracking-wide uppercase text-sm">FAQ</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">Questions? Answers.</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left bg-white hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-slate-900">{faq.q}</span>
                  <ChevronDown
                    className={cn("w-5 h-5 text-slate-500 transition-transform", openFaq === index && "rotate-180")}
                  />
                </button>
                {openFaq === index && <div className="px-6 pb-5 text-slate-600 bg-slate-50">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background Image - Option C: Tech Data */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-tech.png"
            alt="Background"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/95 via-indigo-600/95 to-blue-700/95 mix-blend-multiply" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Reclaim Your Week?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join 500+ teams who've eliminated documentation debt. The power of a $5,000/month consultant—for free.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-10 h-14 text-lg gap-2 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all">
              Create Your First SOP Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center justify-center gap-8 mt-8 text-blue-200 text-sm flex-wrap">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Free forever tier
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Setup in 2 minutes
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
