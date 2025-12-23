"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SOPListItem } from "@/components/library/sop-list-item"
import { SOPGridCard } from "@/components/library/sop-grid-card"
import { SOPTable } from "@/components/library/sop-table"
import { useSOPContext } from "@/lib/sop-context"
import { Search, Plus, List, LayoutGrid, Table, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ViewMode = "list" | "grid" | "table"
type StatusFilter = "all" | "draft" | "complete" | "archived"
type SortOption = "recent" | "a-z" | "z-a" | "department"

export default function LibraryPage() {
  const { sops, deleteSOP, updateSOP } = useSOPContext()
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [sortBy, setSortBy] = useState<SortOption>("recent")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const filteredSOPs = useMemo(() => {
    let result = [...sops]

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((s) => s.status === statusFilter)
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          (s.department ?? "").toLowerCase().includes(query) ||
          s.content.toLowerCase().includes(query),
      )
    }

    // Sort
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

  const statusCounts = useMemo(() => {
    return {
      all: sops.length,
      draft: sops.filter((s) => s.status === "draft").length,
      complete: sops.filter((s) => s.status === "complete").length,
      archived: sops.filter((s) => s.status === "archived").length,
    }
  }, [sops])

  const handleDelete = (id: string) => {
    setShowDeleteConfirm(id)
  }

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      deleteSOP(showDeleteConfirm)
      setShowDeleteConfirm(null)
    }
  }

  const handleArchive = (id: string) => {
    updateSOP(id, { status: "archived" })
  }

  const handleTableSort = (column: string) => {
    if (column === "title") setSortBy(sortBy === "a-z" ? "z-a" : "a-z")
    else if (column === "department") setSortBy("department")
    else if (column === "updatedAt") setSortBy("recent")
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">SOP Library</h1>
            <p className="text-gray-500">Manage all your Standard Operating Procedures</p>
          </div>
          <Link href="/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Plus className="w-4 h-4" />
              New SOP
            </Button>
          </Link>
        </div>

        {/* Search & Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, department, or content..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            {/* Status Filters */}
            <div className="flex overflow-x-auto pb-2 sm:pb-0 gap-2 -mx-1 px-1 sm:mx-0 sm:px-0 sm:flex-wrap">
              {(["all", "draft", "complete", "archived"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-full transition-colors flex items-center gap-1",
                    statusFilter === status
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                  )}
                >
                  <span className="capitalize">{status}</span>
                  <span className="bg-white/50 px-1.5 rounded-full text-xs">{statusCounts[status]}</span>
                </button>
              ))}
            </div>

            {/* Sort & View Mode */}
            <div className="flex items-center gap-2 sm:gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Recent</option>
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
                <option value="department">Department</option>
              </select>

              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === "list" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-900",
                  )}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === "grid" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-900",
                  )}
                  title="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === "table" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-900",
                  )}
                  title="Table view"
                >
                  <Table className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-500 mb-4">
          Showing {filteredSOPs.length} of {sops.length} SOPs
        </p>

        {/* Content */}
        {filteredSOPs.length > 0 ? (
          <>
            {viewMode === "list" && (
              <div className="space-y-3">
                {filteredSOPs.map((sop) => (
                  <SOPListItem key={sop.id} sop={sop} onDelete={handleDelete} onArchive={handleArchive} />
                ))}
              </div>
            )}

            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredSOPs.map((sop) => (
                  <SOPGridCard key={sop.id} sop={sop} />
                ))}
              </div>
            )}

            {viewMode === "table" && (
              <SOPTable
                sops={filteredSOPs}
                onDelete={handleDelete}
                onArchive={handleArchive}
                sortBy={sortBy}
                onSort={handleTableSort}
              />
            )}
          </>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery || statusFilter !== "all" ? "No SOPs found" : "No SOPs yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || statusFilter !== "all"
                ? "Try different search terms or filters"
                : "Create your first SOP to get started"}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Link href="/create">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Create Your First SOP</Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete SOP?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this SOP? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(null)} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button onClick={confirmDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
