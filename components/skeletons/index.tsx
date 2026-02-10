"use client"

import { Skeleton } from "@/components/ui/skeleton"

// =============================================================================
// DASHBOARD SKELETON
// =============================================================================

export function DashboardSkeleton() {
    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <Skeleton className="h-3 w-28 mb-2 rounded" />
                <Skeleton className="h-7 w-52 mb-1.5 rounded" />
                <Skeleton className="h-4 w-40 rounded" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <ActionCardSkeleton />
                <ActionCardSkeleton />
            </div>

            {/* Recent Documents */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <Skeleton className="h-3 w-32 rounded" />
                    <Skeleton className="h-3 w-14 rounded" />
                </div>
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="divide-y divide-slate-100">
                        <DocItemSkeleton />
                        <DocItemSkeleton />
                        <DocItemSkeleton />
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCardSkeleton() {
    return (
        <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200">
            <Skeleton className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg mb-3" />
            <Skeleton className="h-2.5 w-14 mb-1.5 rounded" />
            <Skeleton className="h-6 w-8 rounded" />
        </div>
    )
}

function ActionCardSkeleton() {
    return (
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200">
            <Skeleton className="w-10 h-10 rounded-lg mb-4" />
            <Skeleton className="h-5 w-36 mb-1.5 rounded" />
            <Skeleton className="h-3 w-full mb-1 rounded" />
            <Skeleton className="h-3 w-2/3 mb-4 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
        </div>
    )
}

function DocItemSkeleton() {
    return (
        <div className="flex items-center gap-3 sm:gap-4 px-4 py-3">
            <Skeleton className="w-9 h-9 rounded-lg flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <Skeleton className="h-4 w-36 mb-1.5 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
            </div>
            <Skeleton className="h-4 w-14 rounded hidden sm:block" />
            <Skeleton className="w-4 h-4 rounded flex-shrink-0" />
        </div>
    )
}

// =============================================================================
// SETTINGS SKELETON
// =============================================================================

export function SettingsSkeleton() {
    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
            <div className="mb-6 sm:mb-8">
                <Skeleton className="h-7 w-28 mb-2 rounded" />
                <Skeleton className="h-4 w-56 rounded" />
            </div>

            {/* Subscription */}
            <div className="mb-8">
                <Skeleton className="h-4 w-24 mb-4 rounded" />
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <Skeleton className="h-5 w-28 mb-2 rounded" />
                            <Skeleton className="h-3 w-44 rounded" />
                        </div>
                        <Skeleton className="h-9 w-20 rounded-lg" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 rounded-lg">
                            <Skeleton className="h-3 w-20 mb-2 rounded" />
                            <Skeleton className="h-5 w-12 rounded" />
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                            <Skeleton className="h-3 w-20 mb-2 rounded" />
                            <Skeleton className="h-5 w-12 rounded" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <Skeleton className="h-5 w-28 mb-5 rounded" />
                <div className="flex items-center gap-4 mb-5">
                    <Skeleton className="w-14 h-14 rounded-full" />
                    <div>
                        <Skeleton className="h-4 w-28 mb-2 rounded" />
                        <Skeleton className="h-3 w-40 rounded" />
                    </div>
                </div>
                <Skeleton className="h-9 w-full rounded-lg" />
            </div>
        </div>
    )
}

// =============================================================================
// LIBRARY SKELETON
// =============================================================================

export function LibrarySkeleton() {
    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                    <Skeleton className="h-6 w-28 mb-1.5 rounded" />
                    <Skeleton className="h-3.5 w-52 rounded" />
                </div>
                <Skeleton className="h-9 w-24 rounded-lg" />
            </div>

            {/* Segmented Tab Control */}
            <div className="flex gap-1 p-1 bg-slate-100 rounded-lg mb-5 w-fit">
                <Skeleton className="h-8 w-28 rounded-md bg-white" />
                <Skeleton className="h-8 w-24 rounded-md" />
            </div>

            {/* Filter Bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 mb-4">
                <Skeleton className="h-9 w-full rounded-lg mb-3" />
                <div className="flex gap-1.5">
                    <Skeleton className="h-6 w-12 rounded-md" />
                    <Skeleton className="h-6 w-12 rounded-md" />
                    <Skeleton className="h-6 w-16 rounded-md" />
                    <Skeleton className="h-6 w-16 rounded-md" />
                </div>
            </div>

            {/* Results count */}
            <Skeleton className="h-3 w-24 mb-3 rounded" />

            {/* List items */}
            <div className="space-y-2">
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
        <div className="bg-white rounded-xl px-4 py-3.5 border border-slate-200 flex items-center gap-3 sm:gap-4">
            <Skeleton className="w-9 h-9 rounded-lg flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <Skeleton className="h-4 w-36 mb-1 rounded" />
                <Skeleton className="h-3 w-24 rounded" />
            </div>
            <Skeleton className="w-24 h-1.5 rounded-full hidden sm:block" />
            <Skeleton className="h-3.5 w-16 rounded" />
        </div>
    )
}

// =============================================================================
// DRAFTS SECTION SKELETON
// =============================================================================

export function DraftsSkeleton() {
    return (
        <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-3">
                <Skeleton className="h-3 w-44 rounded" />
                <Skeleton className="h-4 w-5 rounded-full" />
            </div>
            <div className="space-y-2">
                <DraftItemSkeleton />
                <DraftItemSkeleton />
            </div>
        </div>
    )
}

function DraftItemSkeleton() {
    return (
        <div className="bg-white rounded-xl p-3.5 border border-slate-200 flex items-center gap-3 sm:gap-4">
            <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <Skeleton className="h-4 w-36 rounded" />
                    <Skeleton className="h-4 w-14 rounded" />
                </div>
                <Skeleton className="h-3 w-20 rounded" />
            </div>
            <div className="w-28 hidden sm:block">
                <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
            <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
    )
}

// =============================================================================
// GENERIC
// =============================================================================

export function PageLoadingSkeleton() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Loading...</p>
            </div>
        </div>
    )
}
