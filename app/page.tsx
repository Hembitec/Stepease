"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
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
    title: "Conversational AI",
    description:
      "Simply describe your process in plain language. Our AI asks the right questions to capture every detail.",
  },
  {
    icon: Upload,
    title: "Instant Analysis",
    description:
      "Upload existing documents for intelligent review. Get actionable insights and improvement suggestions.",
  },
  {
    icon: Download,
    title: "Universal Export",
    description: "Export to PDF, Word, Markdown, or HTML. Seamlessly integrate with your existing documentation stack.",
  },
  {
    icon: FileText,
    title: "Smart Templates",
    description: "Industry-specific templates built on compliance standards. ISO, SOC2, HIPAA, and more.",
  },
  {
    icon: GitBranch,
    title: "Auto Flowcharts",
    description: "Visual decision trees generated automatically. Make complex processes easy to understand.",
  },
  {
    icon: Shield,
    title: "Compliance Ready",
    description: "Built-in best practices ensure your SOPs meet regulatory requirements from day one.",
  },
]

const steps = [
  {
    number: "01",
    title: "Describe",
    subtitle: "Tell us about your process",
    description: "Start a conversation with our AI. Explain your workflow like you would to a new team member.",
    icon: MessageSquare,
  },
  {
    number: "02",
    title: "Refine",
    subtitle: "Review extracted insights",
    description: "Watch as key steps, requirements, and edge cases are organized into structured notes.",
    icon: Eye,
  },
  {
    number: "03",
    title: "Generate",
    subtitle: "Create your SOP",
    description: "One click transforms your conversation into a polished, professional document.",
    icon: Sparkles,
  },
  {
    number: "04",
    title: "Deploy",
    subtitle: "Share with your team",
    description: "Export, distribute, and start using your new SOP immediately.",
    icon: Zap,
  },
]

const stats = [
  { value: "10x", label: "Faster creation" },
  { value: "85%", label: "Time saved" },
  { value: "500+", label: "Companies trust us" },
  { value: "50K+", label: "SOPs created" },
]

const testimonials = [
  {
    quote:
      "We reduced our SOP creation time from weeks to hours. The AI understands context better than any tool we've tried.",
    author: "Sarah Chen",
    role: "Head of Operations",
    company: "TechFlow Inc.",
  },
  {
    quote: "Finally, documentation that doesn't feel like a chore. Our team actually enjoys the process now.",
    author: "Marcus Johnson",
    role: "Quality Manager",
    company: "MediCare Solutions",
  },
  {
    quote: "The compliance features alone saved us thousands in consulting fees. Incredible value.",
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
    a: "Export to PDF, Word (.docx), Markdown, or HTML. We also support direct integrations with Confluence, Notion, and SharePoint.",
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
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section - Clean, no frame */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-100/30 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-blue-200/50">
              <Sparkles className="w-4 h-4" />
              Stop writing SOPs manually
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-8 leading-[1.1] tracking-tight">
              Documentation that
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                writes itself
              </span>
            </h1>

            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed">
              Transform conversations into compliant, professional SOPs in minutes. No templates to fill. No formatting
              headaches. Just describe your process and let AI do the rest.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-14 text-lg gap-2 shadow-lg shadow-blue-600/25"
                >
                  Start Building Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 h-14 text-lg gap-2 bg-white border-slate-200 hover:bg-slate-50"
                >
                  <Play className="w-5 h-5" />
                  Watch Demo
                </Button>
              </Link>
            </div>

            <p className="text-sm text-slate-500 mt-6">No credit card required. Free tier available forever.</p>
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
      <section id="features" className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold mb-4 tracking-wide uppercase text-sm">Features</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Everything you need, nothing you don't
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Purpose-built tools that make SOP creation fast, accurate, and even enjoyable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all duration-300 bg-white"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                  <feature.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
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
              From startups to enterprises, teams trust StepWise for critical documentation.
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
      <section className="py-24 px-4 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to transform your documentation?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join hundreds of teams who've eliminated documentation debt. Start free, upgrade when you're ready.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-10 h-14 text-lg gap-2 shadow-xl">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center justify-center gap-8 mt-8 text-blue-200 text-sm">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              No credit card
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Free forever tier
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Cancel anytime
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
