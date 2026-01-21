"use client"

import Link from "next/link"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useSOPContext } from "@/lib/sop-context"
import {
  Sparkles,
  Upload,
  ArrowRight,
  FileText,
  Clock,
  CheckCircle2,
  Plus,
  TrendingUp,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DraftsSection } from "@/components/dashboard/drafts-section"

export default function DashboardPage() {
  const { sops } = useSOPContext()
  const sessions = useQuery(api.sessions.list) ?? []
  const recentSOPs = sops.slice(0, 5)

  const draftCount = sessions.length
  const completeCount = sops.filter((s) => s.status === "complete").length

  // Get current date for greeting
  const currentHour = new Date().getHours()
  const greeting =
    currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening"
  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 lg:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                {greeting}, John 👋
              </h1>
              <p className="text-slate-500">
                Pick up where you left off or start something new.
              </p>
            </div>
            <Link href="/create" className="hidden sm:block">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">
                <Plus className="w-4 h-4 mr-2" />
                New SOP
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats - Glassmorphism Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 lg:mb-10">
          {/* Total SOPs */}
          <div className="group relative bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-white/50 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12%</span>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total SOPs</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">{sops.length}</span>
                <span className="text-sm text-slate-400">documents</span>
              </div>
            </div>
          </div>

          {/* In Progress */}
          <div className="group relative bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-white/50 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                {draftCount > 0 && (
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                    Action needed
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">In Progress</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">{draftCount}</span>
                <span className="text-sm text-slate-400">drafts</span>
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="group relative bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-white/50 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 sm:col-span-2 lg:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>On track</span>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">Completed</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">{completeCount}</span>
                <span className="text-sm text-slate-400">published</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 lg:mb-10">
          {/* Create New SOP */}
          <Link href="/create" className="group">
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-600/25 hover:shadow-2xl hover:shadow-blue-600/30 hover:scale-[1.01] transition-all duration-300">
              {/* Glow effect */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-400/30 rounded-full blur-3xl group-hover:bg-blue-300/40 transition-colors" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl" />

              <div className="relative">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2">Create New SOP</h3>
                <p className="text-blue-100 mb-5 text-sm leading-relaxed">
                  Start from scratch with AI-powered assistance to build professional SOPs in minutes.
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-colors">
                  Get started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>

          {/* Improve Existing */}
          <Link href="/improve" className="group">
            <div className="relative overflow-hidden bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl hover:border-emerald-200 hover:scale-[1.01] transition-all duration-300">
              {/* Subtle glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-100/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                  <Upload className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Improve Existing</h3>
                <p className="text-slate-500 mb-5 text-sm leading-relaxed">
                  Upload your current SOPs and let AI analyze and enhance them automatically.
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full group-hover:bg-emerald-100 transition-colors">
                  Upload file
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* In Progress Sessions */}
        <DraftsSection />

        {/* Recent SOPs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Recent Documents</h2>
            <Link
              href="/library"
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentSOPs.length > 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-lg overflow-hidden">
              <div className="divide-y divide-slate-100">
                {recentSOPs.map((sop, index) => (
                  <Link
                    key={sop.id}
                    href={sop.status === "draft" ? `/create?id=${sop.id}` : `/preview/${sop.id}`}
                    className="flex items-center gap-4 p-4 hover:bg-slate-50/80 transition-all group"
                  >
                    <div
                      className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105",
                        sop.status === "complete"
                          ? "bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-emerald-500/25"
                          : "bg-gradient-to-br from-amber-400 to-amber-500 shadow-amber-500/25"
                      )}
                    >
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {sop.title}
                      </h4>
                      <p className="text-sm text-slate-500">{sop.department}</p>
                    </div>
                    <div
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm",
                        sop.status === "complete"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      )}
                    >
                      {sop.status === "complete" ? "Complete" : "Draft"}
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-12 text-center shadow-lg">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                <FileText className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No SOPs yet</h3>
              <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                Create your first SOP to streamline your processes and boost team productivity.
              </p>
              <Link href="/create">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 px-6 py-2.5 transition-all">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First SOP
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
