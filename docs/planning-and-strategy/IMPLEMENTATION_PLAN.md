# Complete System Overhaul Plan

## Pricing Tiers (Final)

| Tier | Price | Creates | Improves | Features |
|------|-------|---------|----------|----------|
| **Free** | $0 | 2/month | ❌ None | Markdown export only, Basic support |
| **Starter** | $29/mo | 12/month | 5/month | All exports (PDF watermarked), Email support |
| **Pro** ⭐ | $79/mo | Unlimited | Unlimited | All exports (clean), Priority support, Version history |

### Export Matrix

| Tier | Markdown | PDF | DOCX | HTML |
|------|----------|-----|------|------|
| Free | ✅ | ❌ | ❌ | ❌ |
| Starter | ✅ | ✅ (watermarked) | ✅ | ✅ |
| Pro | ✅ | ✅ (clean) | ✅ | ✅ |

---

## Issue 1: 100% Sessions Still in "In Progress" Tab

### Problem
The filter `status !== "approved"` doesn't work because **existing sessions don't have the status field** (it's `undefined`).

### Solution
Filter by **BOTH** conditions:
- `status !== "approved"` (for new sessions with status field)
- `phaseProgress < 100` (for existing sessions without status field)

```tsx
// In library/page.tsx
const activeSessions = sessions.filter(s => 
  s.status !== "approved" && s.phaseProgress < 100
)
```

---

## Issue 2: Add "Revise" Option in Completed SOPs

### Current State
Dropdown menu in `sop-list-item.tsx` only has:
- Archive
- Delete

### New State
Add **Revise** option that:
1. Opens the session linked to the SOP
2. Sets session status to "active"
3. Increments revisionCount

### Changes Needed

#### [MODIFY] `components/library/sop-list-item.tsx`

Add `onRevise` prop and menu item:
```tsx
interface SOPListItemProps {
  sop: SOP
  onDelete: (id: string) => void
  onArchive: (id: string) => void
  onRevise: (sessionId: string) => void  // NEW
}

// In dropdown menu, add before Archive:
<DropdownMenuItem onClick={() => sop.sessionId && onRevise(sop.sessionId)}>
  <RefreshCw className="w-4 h-4 mr-2" />
  Revise
</DropdownMenuItem>
```

#### [MODIFY] `app/library/page.tsx`

Add revise handler:
```tsx
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

const reopenSession = useMutation(api.sessions.reopen)

const handleRevise = async (sessionId: string) => {
  // Reopen the session for revisions
  await reopenSession({ id: sessionId as any })
  // Navigate to create page with session
  router.push(`/create?session=${sessionId}`)
}

// Pass to component:
<SOPListItem onRevise={handleRevise} ... />
```

---

## Implementation Summary

| Fix | Files | Status |
|-----|-------|--------|
| Filter 100% sessions | `library/page.tsx` | ⬜ TODO |
| Add Revise option | `sop-list-item.tsx`, `library/page.tsx` | ⬜ TODO |
| Revise handler | `library/page.tsx` | ⬜ TODO |

---

## Phase 3: Export Restrictions (Pending)

- Lock PDF/DOCX/HTML for Free tier
- Add PDF watermark for Starter tier

## Phase 4: Flutterwave (Pending)

- Create plans in dashboard
- Configure webhooks
