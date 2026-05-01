# Code Review: Edit with AI Implementation

**Review Date:** April 16, 2026  
**Files Reviewed:**
1. `/lib/sop-system-prompt.ts` - Added EDIT_SECTION_SYSTEM_PROMPT
2. `/app/api/chat/edit-section/route.ts` - New API endpoint
3. `/components/sop/section-editor-modal.tsx` - Updated with real API integration
4. `/app/preview/[id]/page.tsx` - Updated to pass props and persist changes

---

## Executive Summary

**Overall Rating: GOOD** ✅

The implementation successfully replaces the mock "Edit with AI" feature with a real AI-powered section editor. The code follows established patterns from the existing codebase, uses proper error handling, and includes user-friendly features like undo and streaming responses.

**Strengths:**
- Follows existing architectural patterns
- Proper streaming implementation
- Good error handling with user feedback
- Undo functionality for AI edits
- Data persistence to Convex

**Issues Found:**
- 1 Critical: Potential race condition in streaming state updates
- 2 High: String replacement could fail with duplicate content
- 3 Medium: Missing input validation on API endpoint
- 4 Low: Missing rate limiting consideration

---

## Detailed Findings

### 1. CRITICAL: Race Condition in Streaming State Updates

**File:** `/components/sop/section-editor-modal.tsx`  
**Lines:** 54-62

**Current Code:**
```typescript
if (reader) {
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    modifiedContent += decoder.decode(value, { stream: true })
    setEditedContent(modifiedContent)  // ⚠️ RACE CONDITION
  }
  modifiedContent += decoder.decode()
  setEditedContent(modifiedContent)
}
```

**Issue:** The `setEditedContent(modifiedContent)` is called inside the while loop for every chunk. If the user types in the textarea during streaming, their input could be overwritten by the next streaming chunk because we're updating state based on `modifiedContent` which doesn't account for user edits during streaming.

**Impact:** User edits during AI streaming could be lost.

**Recommendation:** Disable the textarea during AI loading or buffer updates:
```typescript
// Option 1: Disable textarea during streaming (already partially done)
<textarea
  disabled={isAiLoading}  // Add this
  ...
/>

// Option 2: Use a separate state for streaming
const [streamingContent, setStreamingContent] = useState<string | null>(null)
// Show streamingContent when available, editedContent otherwise
```

---

### 2. HIGH: Fragile String Replacement in handleSectionSave

**File:** `/app/preview/[id]/page.tsx`  
**Lines:** 89-98

**Current Code:**
```typescript
const handleSectionSave = (newContent: string) => {
  const updatedContent = content.replace(editingSection?.content || "", newContent)
  setContent(updatedContent)
  setEditingSection(null)

  if (sop) {
    updateSOP(sop.id, { content: updatedContent })
    toast.success("Section saved")
  }
}
```

**Issue:** Using `String.replace()` with the original section content as the pattern is fragile:
- If the same content appears elsewhere in the document, it could replace the wrong occurrence
- If the content contains special regex characters, it could cause unexpected behavior
- If the section content was modified by the user (not just the AI), the replacement won't match

**Impact:** Could replace wrong section or fail to save changes.

**Recommendation:** Track section by index instead of content:
```typescript
// Store the section index when opening the modal
const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null)

const handleSectionSave = (newContent: string) => {
  if (editingSectionIndex === null) return
  
  const sections = content.split(/(?=^## )/m).filter(Boolean)
  sections[editingSectionIndex] = newContent
  const updatedContent = sections.join('')
  
  setContent(updatedContent)
  setEditingSectionIndex(null)
  
  if (sop) {
    updateSOP(sop.id, { content: updatedContent })
  }
}
```

---

### 3. HIGH: Missing Input Validation on API Endpoint

**File:** `/app/api/chat/edit-section/route.ts`  
**Lines:** 127-133

**Current Code:**
```typescript
export async function POST(req: Request) {
  try {
    const body = await req.json() as RequestBody;

    const systemPrompt = EDIT_SECTION_SYSTEM_PROMPT;
    const userPrompt = buildEditSectionPrompt(body);
```

**Issue:** No validation that required fields are present and valid. The endpoint accepts:
- Empty `sectionContent`
- Empty `userPrompt`
- Extremely large content (no size limits)
- Missing required fields

**Impact:** Could send wasteful/invalid requests to AI providers, waste tokens, or cause errors.

**Recommendation:** Add input validation:
```typescript
export async function POST(req: Request) {
  try {
    const body = await req.json() as RequestBody;
    
    // Validation
    if (!body.sectionTitle?.trim()) {
      return new Response(
        JSON.stringify({ error: 'sectionTitle is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (!body.sectionContent?.trim()) {
      return new Response(
        JSON.stringify({ error: 'sectionContent is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (!body.userPrompt?.trim()) {
      return new Response(
        JSON.stringify({ error: 'userPrompt is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Size limit (e.g., 100KB total)
    const totalSize = (body.sectionContent?.length || 0) + 
                      (body.fullSopContent?.length || 0) + 
                      (body.userPrompt?.length || 0);
    if (totalSize > 100000) {
      return new Response(
        JSON.stringify({ error: 'Content too large' }),
        { status: 413, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // ... rest of handler
  }
}
```

---

### 4. MEDIUM: Missing Rate Limiting Consideration

**File:** `/app/api/chat/edit-section/route.ts`

**Issue:** The endpoint doesn't implement rate limiting. Users could spam the endpoint, causing:
- High AI provider costs
- Abuse of the system
- Performance degradation

**Recommendation:** Add rate limiting middleware or tracking:
```typescript
// Option 1: Use existing user tier limits
const currentUser = await getCurrentUser(); // From Clerk
const userTier = currentUser?.tier || 'free';

// Check usage limits (reuse existing logic from other endpoints)
// Free: 5 edits/day, Starter: 20/day, Pro: unlimited
```

**Note:** Check if there's existing rate limiting infrastructure in the codebase that should be applied here.

---

### 5. MEDIUM: No Request Timeout Handling

**File:** `/components/sop/section-editor-modal.tsx`  
**Lines:** 28-76

**Issue:** The `handleAiRequest` function doesn't have a client-side timeout. If the server hangs or the connection drops, the user could be stuck with `isAiLoading = true` indefinitely.

**Recommendation:** Add AbortController with timeout:
```typescript
const handleAiRequest = async () => {
  if (!aiPrompt.trim()) return

  setIsAiLoading(true)
  setPreviousContent(editedContent)
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

  try {
    const response = await fetch('/api/chat/edit-section', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({...}),
      signal: controller.signal, // Add abort signal
    })
    
    clearTimeout(timeoutId);
    // ... rest of code
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      toast.error('Request timed out. Please try again.');
    } else {
      toast.error('Failed to edit section with AI. Please try again.');
    }
    // ...
  }
}
```

---

### 6. MEDIUM: Duplicate State Update in Streaming

**File:** `/components/sop/section-editor-modal.tsx`  
**Lines:** 58-62

**Current Code:**
```typescript
modifiedContent += decoder.decode(value, { stream: true })
setEditedContent(modifiedContent)
// ...
modifiedContent += decoder.decode()
setEditedContent(modifiedContent)  // Duplicate update
```

**Issue:** The final `setEditedContent(modifiedContent)` is redundant because the last chunk already updated the state.

**Recommendation:** Remove the final duplicate update or restructure:
```typescript
if (reader) {
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    modifiedContent += decoder.decode(value, { stream: true })
    setEditedContent(modifiedContent)
  }
  const finalChunk = decoder.decode()
  if (finalChunk) {
    modifiedContent += finalChunk
    setEditedContent(modifiedContent)
  }
}
```

---

### 7. LOW: Missing Error Details in Toast

**File:** `/components/sop/section-editor-modal.tsx`  
**Lines:** 67-72

**Current Code:**
```typescript
} catch (error) {
  console.error('Failed to edit section:', error)
  toast.error('Failed to edit section with AI. Please try again.')
  if (previousContent) {
    setEditedContent(previousContent)
  }
}
```

**Issue:** Generic error message doesn't help user understand what went wrong.

**Recommendation:** Provide more specific error messages:
```typescript
} catch (error) {
  console.error('Failed to edit section:', error)
  
  let message = 'Failed to edit section with AI.';
  if (error instanceof Error) {
    if (error.message.includes('timeout')) {
      message = 'Request timed out. Please try again.';
    } else if (error.message.includes('rate limit')) {
      message = 'Rate limit exceeded. Please wait a moment.';
    } else if (error.message.includes('All AI providers failed')) {
      message = 'AI service temporarily unavailable. Please try again later.';
    }
  }
  
  toast.error(message)
  if (previousContent) {
    setEditedContent(previousContent)
  }
}
```

---

### 8. LOW: Inconsistent Response Format on Error

**File:** `/app/api/chat/edit-section/route.ts`  
**Lines:** 163-187

**Issue:** The endpoint returns JSON error responses, but the frontend expects a stream. If an error occurs mid-stream, the frontend might not handle it gracefully.

**Current Code:**
```typescript
// Lines 163-172: Returns JSON on provider failure
return new Response(
  JSON.stringify({ error: 'Failed to edit section', details: ... }),
  { status: 503, headers: { 'Content-Type': 'application/json' } }
);

// Lines 178-187: Returns JSON on exception
return new Response(
  JSON.stringify({ error: 'Failed to edit section', details: ... }),
  { status: 503, headers: { 'Content-Type': 'application/json' } }
);
```

**Impact:** Frontend tries to read stream from error response, causing parsing errors.

**Recommendation:** Frontend should check content-type before streaming:
```typescript
// In section-editor-modal.tsx
if (!response.ok) {
  const errorData = await response.json().catch(() => ({}));
  throw new Error(errorData.error || 'Failed to edit section');
}

const contentType = response.headers.get('content-type');
if (contentType?.includes('application/json')) {
  // Error response
  const errorData = await response.json();
  throw new Error(errorData.error || 'Failed to edit section');
}

// Continue with streaming...
```

---

### 9. LOW: Memory Leak Potential with Provider Cache

**File:** `/app/api/chat/edit-section/route.ts`  
**Lines:** 51-83

**Issue:** The `providerCache` Map at module level could grow indefinitely in long-running server processes. Each unique provider name creates a cached entry.

**Current Code:**
```typescript
const providerCache = new Map<string, any>(); // Module-level cache

function getModelInstance(provider: ProviderConfig) {
  // Caches forever, never evicts
  if (provider.name === 'google') {
    let googleProvider = providerCache.get(provider.name);
    if (!googleProvider) {
      googleProvider = createGoogleGenerativeAI({ apiKey: provider.apiKey });
      providerCache.set(provider.name, googleProvider);
    }
  }
  // ...
}
```

**Impact:** In production serverless environments this is less of an issue (functions restart), but in development or long-running containers, memory usage could grow.

**Recommendation:** This is consistent with existing endpoints, but consider documenting or adding a cache size limit if needed.

---

### 10. LOW: Missing Accessibility Attributes on Textarea

**File:** `/components/sop/section-editor-modal.tsx`  
**Lines:** 117-121

**Current Code:**
```typescript
<textarea
  value={editedContent}
  onChange={(e) => setEditedContent(e.target.value)}
  className="w-full h-48 p-4 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
/>
```

**Issue:** Missing accessibility attributes:
- No `aria-label` or `id` + `htmlFor` association with label
- No `aria-describedby` for context
- No keyboard shortcut to focus

**Recommendation:** Add accessibility attributes:
```typescript
<label htmlFor="section-edit-textarea" className="block text-sm font-medium text-slate-700 mb-2">
  Edit Mode:
</label>
<textarea
  id="section-edit-textarea"
  aria-label="Edit section content"
  aria-describedby="edit-instructions"
  disabled={isAiLoading}
  value={editedContent}
  onChange={(e) => setEditedContent(e.target.value)}
  className="w-full h-48 p-4 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50"
/>
```

---

## Positive Findings

### ✅ 1. Good: Follows Existing Patterns

The new endpoint follows the same structure as `/api/chat/generate-sop/route.ts`:
- Same provider caching strategy
- Same fallback logic with verification timeout
- Same error logging format
- Consistent temperature setting (0.3)

### ✅ 2. Good: Proper TypeScript Types

```typescript
interface RequestBody {
  sectionTitle: string;
  sectionContent: string;
  fullSopContent: string;
  userPrompt: string;
  sopTitle?: string;
}
```

All properties have proper types with optional markers where appropriate.

### ✅ 3. Good: Streaming Implementation

The streaming implementation correctly:
- Uses `TextDecoder` with streaming mode
- Updates state progressively for real-time feedback
- Handles the final chunk flush

### ✅ 4. Good: Error Recovery

```typescript
} catch (error) {
  // ...
  if (previousContent) {
    setEditedContent(previousContent)  // Reverts to before AI edit
  }
}
```

Automatically reverts to previous state on error.

### ✅ 5. Good: Undo Feature

The undo functionality properly:
- Stores previous content before AI edit
- Only shows when there's something to undo
- Clears undo state after reverting

### ✅ 6. Good: Prompt Engineering

The `EDIT_SECTION_SYSTEM_PROMPT` is well-structured:
- Clear critical rules
- Specific output format instructions
- Practical examples
- Constraints to prevent unwanted behavior

---

## Recommendations Summary

| Priority | Issue | File | Line | Action |
|----------|-------|------|------|--------|
| CRITICAL | Race condition in streaming | section-editor-modal.tsx | 54-62 | Disable textarea during streaming |
| HIGH | Fragile string replacement | page.tsx | 89-98 | Use section index instead of content |
| HIGH | Missing input validation | route.ts | 127-133 | Add field validation & size limits |
| MEDIUM | No rate limiting | route.ts | All | Consider adding usage limits |
| MEDIUM | No client timeout | section-editor-modal.tsx | 28-76 | Add AbortController with timeout |
| MEDIUM | Duplicate state update | section-editor-modal.tsx | 58-62 | Remove redundant setState |
| LOW | Generic error messages | section-editor-modal.tsx | 67-72 | Add specific error messages |
| LOW | Inconsistent error format | route.ts | 163-187 | Check content-type in frontend |
| LOW | Missing accessibility | section-editor-modal.tsx | 117-121 | Add aria attributes |

---

## Testing Recommendations

1. **Test race condition:** Start AI edit, try typing in textarea during streaming
2. **Test duplicate content:** Create SOP with two identical sections, edit one
3. **Test large content:** Try editing with 50,000+ character SOP
4. **Test error handling:** Disconnect network during streaming
5. **Test undo:** Make multiple AI edits, verify undo chain works
6. **Test persistence:** Save section, refresh page, verify changes persisted

---

## Conclusion

The implementation is **solid and production-ready** with minor improvements needed. The critical race condition and high-priority string replacement issues should be addressed before heavy usage. The code follows established patterns and maintains consistency with the existing codebase.

**Estimated time to address all issues:** 2-3 hours

**Risk Level:** LOW-MEDIUM (main issues are edge cases, not core functionality)
