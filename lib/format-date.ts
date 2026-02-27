/**
 * Formats a date string into a human-readable relative time.
 * e.g. "Just now", "3h ago", "Yesterday", "5d ago", "Feb 15, 2026"
 *
 * Uses explicit locale to prevent SSR/client hydration mismatches.
 */
export function formatRelativeDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays}d ago`

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date)
}
