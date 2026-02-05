"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Clock, FileText, Sparkles, Upload } from "lucide-react"

// =============================================================================
// DASHBOARD SKELETON
// =============================================================================

export function DashboardSkeleton() {
    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 lg:mb-10">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-48" />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 lg:mb-10">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 lg:mb-10">
                <QuickActionSkeleton />
                <QuickActionSkeleton />
            </div>

            {/* Recent Documents */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-16" />
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-lg overflow-hidden">
                    <div className="divide-y divide-slate-100">
                        <SOPItemSkeleton />
                        <SOPItemSkeleton />
                        <SOPItemSkeleton />
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCardSkeleton() {
    return (
        <div className="relative bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-white/50 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-16" />
        </div>
    )
}

function QuickActionSkeleton() {
    return (
        <div className="relative overflow-hidden bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
            <Skeleton className="w-14 h-14 rounded-2xl mb-5" />
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-5" />
            <Skeleton className="h-10 w-28 rounded-full" />
        </div>
    )
}

function SOPItemSkeleton() {
    return (
        <div className="flex items-center gap-4 p-4">
            <Skeleton className="w-11 h-11 rounded-xl" />
            <div className="flex-1 min-w-0">
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="w-5 h-5" />
        </div>
    )
}

// =============================================================================
// SETTINGS SKELETON
// =============================================================================

export function SettingsSkeleton() {
    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-64" />
            </div>

            {/* Subscription Section */}
            <div className="mb-8">
                <Skeleton className="h-6 w-28 mb-4" />
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <Skeleton className="h-6 w-32 mb-2" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                        <Skeleton className="h-10 w-24 rounded-lg" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-6 w-16" />
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-6 w-16" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Section Placeholder */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
                <Skeleton className="h-6 w-32 mb-6" />
                <div className="flex items-center gap-4 mb-6">
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <div>
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
                <Skeleton className="h-10 w-full rounded-lg" />
            </div>
        </div>
    )
}

// =============================================================================
// LIBRARY SKELETON
// =============================================================================

export function LibrarySkeleton() {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <Skeleton className="h-8 w-36 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-28 rounded-lg" />
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2 mb-6">
                <Skeleton className="h-10 w-36 rounded-xl" />
                <Skeleton className="h-10 w-32 rounded-xl" />
            </div>

            {/* Filter Bar */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
                <Skeleton className="h-10 w-full rounded-lg mb-4" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-16 rounded-full" />
                    <Skeleton className="h-8 w-16 rounded-full" />
                    <Skeleton className="h-8 w-20 rounded-full" />
                    <Skeleton className="h-8 w-20 rounded-full" />
                </div>
            </div>

            {/* Results Count */}
            <Skeleton className="h-4 w-32 mb-4" />

            {/* List Items */}
            <div className="space-y-3">
                <LibraryItemSkeleton />
                <LibraryItemSkeleton />
                <LibraryItemSkeleton />
                <LibraryItemSkeleton />
            </div>
        </div>
    )
}

function LibraryItemSkeleton() {
    return (
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="flex-1 min-w-0">
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="w-32 h-2 rounded-full hidden sm:block" />
            <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
    )
}

// =============================================================================
// DRAFTS SECTION SKELETON
// =============================================================================

export function DraftsSkeleton() {
    return (
        <div className="mb-8 lg:mb-10">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-slate-300" />
                    <Skeleton className="h-6 w-56" />
                    <Skeleton className="h-5 w-6 rounded-full" />
                </div>
            </div>
            <div className="space-y-3">
                <DraftItemSkeleton />
                <DraftItemSkeleton />
            </div>
        </div>
    )
}

function DraftItemSkeleton() {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200/80 shadow-lg flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-24" />
            </div>
            <div className="w-32 hidden sm:block">
                <Skeleton className="h-2 w-full rounded-full" />
            </div>
            <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
    )
}

// =============================================================================
// GENERIC SKELETONS
// =============================================================================

export function PageLoadingSkeleton() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-500 text-sm">Loading...</p>
            </div>
        </div>
    )
}
