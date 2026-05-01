# Hero & Stats Section - Redesign Analysis

## Executive Summary

The hybrid copy implementation revealed a fundamental mismatch: **the new copy was designed to be short, punchy, and emotionally impactful—but the existing hero layout was designed around longer, informational copy**. This isn't a code problem, it's a visual hierarchy problem. The shorter copy exposed gaps in the layout that were previously hidden by volume.

---

## Section 1: Understanding the Problem

### Current State After Implementation

The planned hero copy is:

| Element | New Copy | Visual Impact |
|---------|----------|---------------|
| **Pre-headline** | "Your team's knowledge lives in people's heads. That's a risk." | Full sentence, 14 words. Too long for badge styling. |
| **Headline** | "Stop explaining things over and over." | Only 5 words. Will look visually "empty" at 5xl-7xl size. |
| **Subheadline** | "Describe your process out loud. Get a polished, audit-ready SOP in under 10 minutes." | 2 sentences, clean, but short |
| **Primary CTA** | "Build Your First SOP Free — Takes 10 Minutes" | 8 words + timing. Longer than before. |
| **Secondary CTA** | "Watch It Work" | 3 words. Very short. |
| **Micro-copy** | "No credit card required · Free forever · Setup in 2 minutes" | Compact with · separators |

### Why It Looks "Weird"

1. **Headline visual void** — The original "Build Professional SOPs in Minutes, Not Weeks" was 2 lines with gradient emphasis. "Stop explaining things over and over." is 5 words. At `text-5xl sm:text-6xl lg:text-7xl` with `leading-[1.1]`, it will span one line with enormous white space on the right.

2. **Pre-headline badge abuse** — The pill badge (rounded-full, bg-blue-600/10, text-sm) was designed for labels like "New Feature" or "Popular". A 14-word sentence crammed into this looks cramped and breaks the visual flow.

3. **CTA width mismatch** — "Build Your First SOP Free — Takes 10 Minutes" is ~40 characters. The original "Create Your First SOP Free" was ~27 characters. The button will be 50% wider, potentially breaking the side-by-side layout with "Watch It Work".

4. **Stats strip disconnection** — The stats section (`<10 min`, `12+ hrs`, `500+`, `47,892`) exists to provide social proof. The new copy removed "Trusted by 500+ teams" from the subheadline—so the stats feel orphaned. They no longer support copy that doesn't mention them.

---

## Section 2: Visual Structure Analysis

### Original Layout (Designed for Volume)

```
[BADGE: "Stop writing SOPs manually"]
[H1: "Build Professional SOPs"]
[    "in Minutes, Not Weeks"]  ← 2 lines, gradient
[P: "Tell AI about your process..."]  ← 3 sentences, social proof
[BUTTON] [BUTTON]  ← equal width
[P: "No credit card required"] [P: "Free forever tier"]

[STATS: 4 columns of numbers]
```

### New Layout (Designed for Punch)

```
[BADGE: "Your team's knowledge lives in..."]  ← WRONG - too long for badge
[H1: "Stop explaining things over and over."]  ← WRONG - looks empty, 1 line
[P: "Describe your process..."]  ← 2 sentences
[BUTTON — longer] [BUTTON — shorter]  ← uneven
[P: "No credit card required · Free forever · Setup in 2 minutes"]

[STATS: 4 columns of numbers]  ← orphaned - no connection to copy
```

### The Core Issue

**Short copy needs different visual treatment.** Punchy copy works when:
- Headlines are short but LARGE (fills the space)
- Supporting copy is minimal but positioned to balance
- White space is intentional, not accidental
- Trust indicators are integrated, not listed separately

---

## Section 3: Hero Copy Redesign Options

### Option A: Keep Badge, Shorten Pre-headline

**Principle:** The badge/pill format is correct for the layout. Adjust copy to fit.

| Element | Adjusted Copy | Rationale |
|---------|---------------|-----------|
| **Pre-headline** | "Knowledge in heads is a risk" or "Don't let knowledge walk out the door" | 6-8 words max. Fits badge styling. Punchy. |
| **Headline** | "Stop explaining things over and over." | Keep as-is, but consider adding accent color or gradient to fill visual space |
| **Subheadline** | "Describe your process out loud. Get a polished, audit-ready SOP in under 10 minutes." | Works well |

**Pros:** Minimal changes, maintains badge structure
**Cons:** Loses the strategic "people's heads" framing that was the key V2 improvement

### Option B: Convert Pre-headline to a Callout

**Principle:** Remove badge styling, use a different format for the longer pre-headline.

| Element | Adjusted Copy | Structure |
|---------|---------------|-----------|
| **Pre-headline** | "Your team's knowledge lives in people's heads. That's a risk." | Remove pill styling, use text-block with subtle left border or icon |
| **Headline** | "Stop explaining things over and over." | Keep, add more bottom margin to let it breathe |
| **Subheadline** | "Describe your process out loud. Get a polished, audit-ready SOP in under 10 minutes." | Keep |
| **CTA** | "Build Your First SOP Free" (remove "— Takes 10 Minutes" from button, move to micro-copy) | Reduces button width, keeps timing in micro-copy |

**Pros:** Pre-headline gets proper treatment as strategic callout. CTA widths balanced.
**Cons:** Requires styling changes beyond copy

### Option C: Expand Headline Intentionally

**Principle:** Make the short headline feel intentional by adding a visual line or supporting text.

| Element | Adjusted Copy | Structure |
|---------|---------------|-----------|
| **Pre-headline** | "Your team's knowledge lives in people's heads. That's a risk." | Keep as badge (needs shortening) OR convert to callout |
| **Headline** | "Stop explaining things over and over." + decorative element | Add small accent text below, like "The SOP that writes itself" |
| **Subheadline** | "Describe your process out loud. Get a polished, audit-ready SOP in under 10 minutes." | Keep |
| **CTA** | "Build Your First SOP Free — Takes 10 Minutes" | Keep, accept wider button |

**Pros:** Creates visual balance, makes brevity feel intentional
**Cons:** Adds more elements to manage

---

## Section 4: Stats Section Redesign Options

### The Problem with Current Stats

The stats strip currently shows:
- `<10 min` — Average SOP creation
- `12+ hrs` — Saved per document
- `500+` — Teams trust us
- `47,892` — SOPs created

**Issues:**
1. **"12+ hrs saved" is vague** — Saved compared to what? Manual documentation? This metric needs context.
2. **Orphaned proof** — After removing "Trusted by 500+ teams" from hero subheadline, there's no connection between hero and stats.
3. **Layout redundancy** — The plan also calls for replacing Testimonials with a metric strip. Having two metric sections may be redundant.

### Option 1: Remove Stats Strip (Recommended)

**Rationale:** The new hero copy is punchy and doesn't reference team size or SOP count. The stats strip feels disconnected. A clean, copy-focused hero doesn't need floating proof.

**Action:** Remove the stats section (Lines 259-271 in page.tsx)
**Benefit:** Cleaner visual flow, hero copy stands on its own

### Option 2: Integrate Stats into Hero

**Principle:** If stats are important, integrate them into the hero section rather than as a separate strip.

| Element | Location | Copy |
|---------|----------|------|
| **Stats** | Below subheadline, above CTAs | 3 numbers inline: "47,892 SOPs created · 9 min avg · 500+ teams" |

**Benefit:** Proof becomes part of the hero narrative, not an afterthought
**Risk:** Could make hero too busy

### Option 3: Repurpose Stats Strip for Social Proof Callout

**Principle:** Replace numbers with a single compelling proof statement.

| Element | Copy |
|---------|------|
| **Replace stats with** | "Used by operations teams at TechFlow, MediCare Solutions, and 498 other companies" |

**Benefit:** More human, less "counter-like"
**Risk:** Less immediate credibility than numbers

### Option 4: Keep But Reposition Below Demo/Features

**Principle:** Move stats to a position where they support a claim being made.

| Current Location | New Location |
|------------------|--------------|
| Below hero | Below "How It Works" section, before Features |

**Rationale:** Stats make more sense after explaining what the product does
**Benefit:** Proof comes after explanation, not before

---

## Section 5: Integrated Recommendations

### Recommended Hero Structure

```
[PRE-HEADLINE CALLOUT]
"Your team's knowledge lives in people's heads. That's a risk."
(Styled as: left-border accent box, not pill badge)

[HEADLINE]
"Stop explaining things over and over."
(Font: 7xl, bold, with subtle blue gradient on "over and over")

[SUBHEADLINE]
"Describe your process out loud. Get a polished, audit-ready SOP in under 10 minutes."
(Font: xl, muted-foreground, max-w-2xl)

[INLINE STATS - integrated]
"47,892 teams · 9 min average · $0 to start"
(Font: sm, blue-600, positioned between subheadline and CTAs)

[CTA BUTTONS]
[Build Your First SOP Free]  [Watch It Work]
(Primary: gradient, Secondary: outline)

[MICRO-COPY]
No credit card required · Free forever · Setup in 2 minutes
(Font: sm, muted)
```

### Key Visual Changes Needed

1. **Pre-headline:** Convert from pill badge to callout box with left border
2. **Headline:** Add subtle gradient or color accent to fill visual weight
3. **Stats:** Integrate into hero as inline proof between subheadline and CTAs
4. **CTA:** Remove "— Takes 10 Minutes" from button text, move to micro-copy
5. **Stats Strip:** Remove entirely (no longer needed with inline proof)

---

## Section 6: Implementation Plan (Before Writing Code)

### Step 1: Finalize Hero Copy Structure

**Decision needed:** Choose Option A, B, or C for pre-headline treatment

### Step 2: Decide on Stats Placement

**Decision needed:**
- Remove stats strip entirely (cleanest)?
- Integrate inline into hero (most cohesive)?
- Reposition to after How It Works (most logical flow)?

### Step 3: CTA Button Width

**Decision needed:** Keep "Takes 10 Minutes" in button or move to micro-copy?

### Step 4: Confirm Testimonials → Metric Strip

The plan calls for replacing Testimonials with:
```
47,892 SOPs created  |  9 min average  |  500+ Teams
```

**Question:** With stats either removed or moved, do we still want this strip? What proof do we want to show here?

---

## Section 7: Questions to Resolve Before Implementation

1. **Pre-headline style:** Pill badge (shorten copy) or callout box (keep full copy)?
2. **Stats section:** Remove entirely, integrate inline, or reposition?
3. **Headline accent:** Add gradient/color to headline text for visual weight?
4. **CTA timing text:** Keep in button or move to micro-copy?
5. **Testimonials replacement:** Keep metric strip if stats are removed from hero?

---

## Appendix: Current Color Tokens (for reference)

```css
--blue-600: oklch(0.646 0.222 41.116)  /* Primary action */
--blue-400: oklch(0.708 0 0)  /* Lighter accent */
--indigo-600: oklch(0.398 0.07 227.392)  /* Secondary */
--slate-900: oklch(0.269 0 0)  /* Dark backgrounds */
--slate-600: oklch(0.556 0 0)  /* Muted text */
--foreground: oklch(0.145 0 0)  /* Body text */
```