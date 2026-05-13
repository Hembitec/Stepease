"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  ArrowRight,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { HeroSection } from "@/components/hero/hero-section"
import {
  features,
  steps,
  testimonials,
  useCases,
  faqs,
} from "@/lib/landing-data"

// Lazy load below-the-fold components
const PricingSection = dynamic(() => import("@/components/pricing").then(mod => mod.PricingSection), {
  loading: () => <div className="py-24 animate-pulse bg-slate-50 h-[600px]" />,
  ssr: false
})

const DemoShowcase = dynamic(() => import("@/components/landing/demo-showcase").then(mod => mod.DemoShowcase), {
  loading: () => <div className="py-24 animate-pulse bg-slate-50/50 h-[500px]" />,
  ssr: false
})

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero Section - Minimal & Editorial */}
      <HeroSection />

      <section className="px-4 pb-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 border-y border-slate-200 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-medium text-slate-600">Trusted by fast-moving ops, compliance, and enablement teams.</span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>
              <span className="font-semibold text-slate-900">47,892</span> SOPs created
            </span>
            <span>
              <span className="font-semibold text-slate-900">&lt;10 min</span> average first draft
            </span>
            <span>
              <span className="font-semibold text-slate-900">12+ hrs</span> saved per document
            </span>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <feature.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
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
              Watch Stepease capture the conversation, extract structured notes, route them through review, and generate an export-ready SOP draft.
            </p>
          </div>

          <DemoShowcase />
        </div>
      </section>

      <section id="how-it-works" className="border-y border-slate-200/70 bg-white py-24 px-4">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,18rem)_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
              How it works
            </p>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
              How Stepease builds the SOP
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-slate-600">
              Describe the work once. Stepease turns it into a structured interview, a reviewed note set, and a final document your team can publish.
            </p>
          </div>

          <div className="relative">
            <div className="absolute bottom-0 left-5 top-0 w-px bg-slate-200 md:left-1/2 md:-translate-x-px" />
            <div className="space-y-5">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="relative grid gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5 sm:p-6 md:grid-cols-2 md:gap-8"
                >
                  <div className={cn("pl-14 md:pl-0", index % 2 === 1 && "md:order-2")}>
                    <div className="flex items-center gap-2 text-slate-500">
                      <step.icon className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                        {step.subtitle}
                      </span>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
                      {step.description}
                    </p>
                  </div>

                  <div className={cn("pl-14 md:pl-0", index % 2 === 1 && "md:order-1")}>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        What shows up in the product
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-slate-700">
                        {step.detail}
                      </p>
                    </div>
                  </div>

                  <div className="absolute left-0 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-slate-900 bg-slate-900 text-sm font-semibold text-white md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
                    {step.number}
                  </div>
                </div>
              ))}
            </div>
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
