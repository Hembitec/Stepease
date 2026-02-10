"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SOPListItem } from "@/components/library/sop-list-item"
import { SOPGridCard } from "@/components/library/sop-grid-card"
import { SOPTable } from "@/components/library/sop-table"
import { useSOPContext } from "@/lib/sop-context"
import { useSidebar } from "@/components/layout/sidebar-context"
import { Search, Plus, List, LayoutGrid, Table, FileText, Clock, Sparkles, Upload, ArrowRight, Play, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LibrarySkeleton } from "@/components/skeletons"

type ViewMode = "list" | "grid" | "table"
type StatusFilter = "all" | "draft" | "complete" | "archived"
type SortOption = "recent" | "a-z" | "z-a" | "department"
type LibraryTab = "completed" | "in-progress"

export default function LibraryPage() {
  const router = useRouter()
  const { sops, deleteSOP, updateSOP } = useSOPContext()
  const { toggleMobileMenu } = useSidebar()
  const sessionsResult = useQuery(api.sessions.list)
  const reopenSession = useMutation(api.sessions.reopen)

  const [activeTab, setActiveTab] = useState<LibraryTab>("completed")
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [sortBy, setSortBy] = useState<SortOption>("recent")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const sessions = sessionsResult ?? []
  const inProgressSessions = sessions.filter(s => s.status !== "approved" && s.phaseProgress < 100)

  const filteredSOPs = useMemo(() => {
    let result = [...sops]

    if (statusFilter !== "all") {
      result = result.filter((s) => s.status === statusFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          (s.department ?? "").toLowerCase().includes(query) ||
          s.content.toLowerCase().includes(query),
      )
    }

    switch (sortBy) {
      case "recent":
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        break
      case "a-z":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "z-a":
        result.sort((a, b) => b.title.localeCompare(a.title))
        break
      case "department":
        result.sort((a, b) => (a.department ?? "").localeCompare(b.department ?? ""))
        break
    }

    return result
  }, [sops, statusFilter, searchQuery, sortBy])

  const statusCounts = useMemo(() => ({
    all: sops.length,
    draft: sops.filter((s) => s.status === "draft").length,
    complete: sops.filter((s) => s.status === "complete").length,
    archived: sops.filter((s) => s.status === "archived").length,
  }), [sops])

  // Show skeleton while loading
  if (sessionsResult === undefined) {
    return (
      <DashboardLayout>
        <LibrarySkeleton />
      </DashboardLayout>
    )
  }

  const handleDelete = (id: string) => setShowDeleteConfirm(id)

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      deleteSOP(showDeleteConfirm)
      setShowDeleteConfirm(null)
    }
  }

  const handleArchive = (id: string) => updateSOP(id, { status: "archived" })

  const handleTableSort = (column: string) => {
    if (column === "title") setSortBy(sortBy === "a-z" ? "z-a" : "a-z")
    else if (column === "department") setSortBy("department")
    else if (column === "updatedAt") setSortBy("recent")
  }

  const handleRevise = async (sessionId: string) => {
    try {
      await reopenSession({ id: sessionId as any })
      router.push(`/create?session=${sessionId}`)
    } catch (e) {
      console.error("Failed to reopen session:", e)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-1 -ml-1 text-slate-600 hover:text-slate-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">SOP Library</h1>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">Manage all your Standard Operating Procedures</p>
          </div>
          <Link href="/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm shadow-sm">
              <Plus className="w-4 h-4 mr-1.5" />
              New SOP
            </Button>
          </Link>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg mb-5 w-fit">
          <button
            onClick={() => setActiveTab("completed")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
              activeTab === "completed"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <FileText className="w-3.5 h-3.5" />
            Completed
            <span className={cn(
              "text-[11px] px-1.5 py-0.5 rounded-full font-medium",
              activeTab === "completed" ? "bg-slate-100 text-slate-600" : "bg-slate-200/60 text-slate-500"
            )}>
              {sops.filter(s => s.status === "complete").length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("in-progress")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
              activeTab === "in-progress"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Clock className="w-3.5 h-3.5" />
            In Progress
            <span className={cn(
              "text-[11px] px-1.5 py-0.5 rounded-full font-medium",
              activeTab === "in-progress" ? "bg-amber-100 text-amber-700" : "bg-slate-200/60 text-slate-500"
            )}>
              {inProgressSessions.length}
            </span>
          </button>
        </div>

        {activeTab === "in-progress" ? (
          <InProgressView sessions={inProgressSessions} />
        ) : (
          <CompletedView
            filteredSOPs={filteredSOPs}
            sops={sops}
            statusCounts={statusCounts}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onDelete={handleDelete}
            onArchive={handleArchive}
            onRevise={handleRevise}
            onTableSort={handleTableSort}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-base font-semibold text-slate-900 mb-1.5">Delete SOP?</h3>
            <p className="text-sm text-slate-500 mb-5">
              This action cannot be undone. The SOP will be permanently removed.
            </p>
            <div className="flex gap-2.5">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(null)} className="flex-1 bg-transparent text-sm">
                Cancel
              </Button>
              <Button onClick={confirmDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

// =============================================================================
// In-Progress View
// =============================================================================

interface InProgressViewProps {
  sessions: any[]
}

function InProgressView({ sessions }: InProgressViewProps) {
  if (sessions.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 text-center">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Clock className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">No sessions in progress</h3>
        <p className="text-sm text-slate-500 mb-5">Start creating or improving an SOP to see it here</p>
        <div className="flex gap-2.5 justify-center">
          <Link href="/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm">Create New</Button>
          </Link>
          <Link href="/improve">
            <Button variant="outline" className="text-sm">Improve Existing</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {sessions.map((session) => {
        const progress = session.phaseProgress
        const isImprove = session.metadata?.mode === "improve"

        return (
          <Link
            key={session._id}
            href={isImprove
              ? `/create?mode=improve&session=${session._id}`
              : `/create?session=${session._id}`}
            className="group block"
          >
            <div className="bg-white rounded-xl px-4 py-3.5 border border-slate-200 hover:border-slate-300 transition-all flex items-center gap-3 sm:gap-4">
              {/* Icon */}
              <div className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                isImprove ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
              )}>
                {isImprove ? <Upload className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                    {session.title}
                  </h3>
                  <span className={cn(
                    "text-[10px] font-medium px-1.5 py-0.5 rounded flex-shrink-0",
                    isImprove ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
                  )}>
                    {isImprove ? "Improving" : "Creating"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 capitalize">Phase: {session.phase}</p>
              </div>

              {/* Progress */}
              <div className="w-28 flex-shrink-0 hidden sm:block">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Progress</span>
                  <span className="font-medium text-slate-600">{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", isImprove ? "bg-emerald-500" : "bg-blue-500")}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Continue */}
              <div className="flex items-center gap-1 text-xs font-medium text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0">
                <Play className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Continue</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

// =============================================================================
// Completed View (Search, Filters, List/Grid/Table)
// =============================================================================

interface CompletedViewProps {
  filteredSOPs: any[]
  sops: any[]
  statusCounts: Record<string, number>
  searchQuery: string
  setSearchQuery: (q: string) => void
  statusFilter: StatusFilter
  setStatusFilter: (f: StatusFilter) => void
  sortBy: SortOption
  setSortBy: (s: SortOption) => void
  viewMode: ViewMode
  setViewMode: (v: ViewMode) => void
  onDelete: (id: string) => void
  onArchive: (id: string) => void
  onRevise: (sessionId: string) => void
  onTableSort: (col: string) => void
}

function CompletedView({
  filteredSOPs, sops, statusCounts,
  searchQuery, setSearchQuery,
  statusFilter, setStatusFilter,
  sortBy, setSortBy,
  viewMode, setViewMode,
  onDelete, onArchive, onRevise, onTableSort,
}: CompletedViewProps) {
  return (
    <>
      {/* Search & Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 mb-4">
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, department, or content..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          {/* Status Filters */}
          <div className="flex overflow-x-auto gap-1.5 -mx-1 px-1 sm:mx-0 sm:px-0 sm:flex-wrap pb-1 sm:pb-0">
            {(["all", "draft", "complete", "archived"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 whitespace-nowrap",
                  statusFilter === status
                    ? "bg-blue-50 text-blue-700"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700",
                )}
              >
                <span className="capitalize">{status}</span>
                <span className={cn(
                  "text-[10px] px-1 rounded",
                  statusFilter === status ? "bg-blue-100/80" : "bg-slate-100"
                )}>
                  {statusCounts[status]}
                </span>
              </button>
            ))}
          </div>

          {/* Sort & View Mode */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="recent">Recent</option>
              <option value="a-z">A-Z</option>
              <option value="z-a">Z-A</option>
              <option value="department">Department</option>
            </select>

            <div className="flex bg-slate-100 rounded-lg p-0.5">
              {([
                { mode: "list" as const, icon: List },
                { mode: "grid" as const, icon: LayoutGrid },
                { mode: "table" as const, icon: Table },
              ]).map(({ mode, icon: Icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    viewMode === mode ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-700",
                  )}
                  title={`${mode} view`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-xs text-slate-400 mb-3">
        Showing {filteredSOPs.length} of {sops.length} SOPs
      </p>

      {/* Content */}
      {filteredSOPs.length > 0 ? (
        <>
          {viewMode === "list" && (
            <div className="space-y-2">
              {filteredSOPs.map((sop) => (
                <SOPListItem key={sop.id} sop={sop} onDelete={onDelete} onArchive={onArchive} onRevise={onRevise} />
              ))}
            </div>
          )}

          {viewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredSOPs.map((sop) => (
                <SOPGridCard key={sop.id} sop={sop} />
              ))}
            </div>
          )}

          {viewMode === "table" && (
            <SOPTable
              sops={filteredSOPs}
              onDelete={onDelete}
              onArchive={onArchive}
              sortBy={sortBy}
              onSort={onTableSort}
            />
          )}
        </>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-1">
            {searchQuery || statusFilter !== "all" ? "No SOPs found" : "No SOPs yet"}
          </h3>
          <p className="text-sm text-slate-500 mb-5">
            {searchQuery || statusFilter !== "all"
              ? "Try different search terms or filters"
              : "Create your first SOP to get started"}
          </p>
          {!searchQuery && statusFilter === "all" && (
            <Link href="/create">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm">Create Your First SOP</Button>
            </Link>
          )}
        </div>
      )}
    </>
  )
}
