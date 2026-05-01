# Landing Page Implementation Plan

> Scope: All landing page sections **except Hero**.  
> Priority: P0 = Must fix before visitors see it. P1 = Fix this sprint. P2 = Polish next sprint.

---

## Quick Reference

| Section | Priority | Est. | Key Fix |
|---------|----------|------|---------|
| Testimonials | P0 | 3h | Kill carousel, show all 3, add avatars, rewrite names |
| Pricing | P0 | 4h | Kill gradient card, add annual toggle, fix badge, add trust signals |
| Features | P0 | 4h | Break card grid — asymmetric layout, dominant primary feature |
| Stats | P1 | 2h | Count-up animation, believable numbers, ratio visualization |
| Navbar | P1 | 2h | Scrollspy, smooth scroll, logo mark, mobile polish |
| Demo Framing | P1 | 2h | Kill gradient button, rewrite idle copy, add pause/resume |
| How It Works | P1 | 3h | Timeline/connected path instead of isolated cards |
| Use Cases | P1 | 2h | Kill card grid — use real scenarios with specificity |
| FAQ | P1 | 2h | Expand to 6-8 questions, rewrite AI-sounding answer, add CTA |
| CTA | P1 | 1h | Rewrite headline, add social proof, add secondary action |
| Footer | P2 | 2h | Add newsletter, real links, more columns, app preview |

---

## 1. NAVBAR (`components/layout/navbar.tsx`)

### P0
- **Add scrollspy**: Use IntersectionObserver on `#features`, `#how-it-works`, `#pricing`, `#demo`. Active link gets `font-medium` + a `2px` underline element with `scale-x` transition.
- **Replace `<Link>` with `<a>` for hash anchors**: Next.js `<Link>` hard-navigates to hash. Use `<a>` or `scrollIntoView({ behavior: "smooth" })`.
- **Kill bracket gimmick**: Remove `[` `]` from logo. Create a small SVG mark (stylized S or document icon) for nav + favicon + footer.

### P1
- **Add "Demo" to nav links**: Link to `#demo` — major asset currently unlinked.
- **Smooth scroll transition**: Instead of snap at 10px, use `0-50px: transparent`, `50-150px: bg-white/50`, `150px+: bg-white/95` with opacity-based border fade.
- **Restyle auth buttons**: Sign In = ghost + subtle border. Sign Up = solid brand color. Dashboard button should look primary, not ghost.
- **Mobile menu polish**: Add `translateY + opacity` transition, backdrop overlay, body scroll lock, auto-close on link click.

### P2
- Add "Beta" pill near logo. Add "What's New" link.

---

## 2. STATS (`app/page.tsx:192-203`)

### P0
- **Fix numbers**: "47,892" → "50,000+" (round up, add +). Absurd precision = fake. If real data exists, use it.
- **Add count-up animation**: `requestAnimationFrame` triggered by IntersectionObserver (`threshold: 0.5`). Duration ~2s, easeOutQuart.

### P1
- **Add "Used by" logo bar**: Single row of grayscale company logos below stats. Or text: "Trusted by teams at [industry] companies".
- **Asymmetric layout**: Make "<10 min" and "12+ hrs saved" a visually connected pair (timeline style). "500+ teams" and "50,000+ SOPs" as supporting pair.
- **Kill generic border divider**: Remove `border-y border-slate-100 bg-slate-50/50`. Let hero bleed into stats or use subtle gradient fade.

### P2
- Add mini sparklines: "SOPs created" with "↑ 23% this month" sublabel.

---

## 3. FEATURES (`app/page.tsx:206-233`)

### P0
- **Kill 3-column identical grid**: Primary feature ("Just Talk, We'll Write") gets full-width or 2/3 treatment with mockup/screenshot. Secondary features use 2-column mixed layout. Minimum 3 different card sizes.
- **Kill colored hover glow**: Remove `hover:shadow-xl hover:shadow-blue-600/5`. Use `hover:-translate-y-0.5 hover:shadow-md` (no colored shadow) or just `hover:border-slate-300`.
- **Rewrite copy**: Eyebrow: "Core capabilities". Headline: "Turn conversation into documentation". Subheadline: "Describe your process once. Stepease structures, formats, and versions it automatically."

### P1
- **Add feature depth**: "Learn more →" per card that expands in-place showing screenshot + 2-3 bullets.
- **Vary icon treatments**: Primary feature = no icon container or large illustration. Secondaries = smaller inline line icons. One feature = text + image only.
- **Connect with narrative**: Show "Just Talk → AI captures → Export anywhere" workflow, not isolated capabilities.

### P2
- Add micro-interaction on primary feature: subtle animated input cursor in mockup.

---

## 4. DEMO SECTION (`demo-showcase.tsx` + `page.tsx`)

### P0
- **Kill gradient button**: Replace `bg-gradient-to-r from-blue-600 to-indigo-600` with solid `bg-slate-900`. Use `hover:bg-slate-800`. No scale, no colored shadow.
- **Rewrite idle copy**: "See how it works" / "In this 60-second walkthrough, Stepease interviews you about a process and builds a complete SOP." Button: "Start Walkthrough" (not "Play Demo").
- **Rewrite section framing in page.tsx**: Eyebrow: "Live walkthrough". Headline: "From your words to a finished document". Remove passive "Watch our AI..." language.

### P1
- **Add pause/resume**: Pause button in mock window chrome. Spacebar toggles. Overlay "Paused — press space to continue".
- **Add skip-to-end**: "Skip to result" link during playback. Restart button available throughout.
- **Fix phase bar**: Replace tiny dots with labeled segments showing phase names (Context, Interview, Review, Generate). Use thin connected line that fills progressively.

### P2
- Add "Try with your own process" teaser after completion, linking to `/dashboard`.

---

## 5. HOW IT WORKS (`app/page.tsx:256-287`)

### P0
- **Kill 4-column card grid**: Use horizontal timeline on desktop (vertical on mobile). Steps connected by animated line/path.
- **Kill ghost numbers**: Remove `text-slate-100` watermark numbers. Use visible circles with numbers, connected by line.
- **Rewrite headline**: "How Stepease builds your SOP" (not "Four steps to perfect documentation"). Subheadline: "A structured conversation that turns your expertise into a professional document."

### P1
- **Connect steps visually**: Desktop = horizontal line with 4 nodes. SVG `stroke-dashoffset` animation draws line on scroll. Mobile = vertical line with left-aligned nodes.
- **Reduce elements per step**: One icon + title + one-sentence description. Kill subtitle redundancy.
- **Add step-specific imagery**: Each node has a small illustration/screenshot showing that step's UI state.

### P2
- Animate each node expanding into view as user scrolls. Pulse effect on active node.

---

## 6. USE CASES (`app/page.tsx:290-312`)

### P0
- **Kill 4-column card grid**: Replace with 2 real-world scenario blocks. Each block: scenario title, specific team size/industry, quote snippet, outcome metric, small screenshot.
- **Add specificity**: "A 12-person fintech onboarding new engineers every 2 weeks" beats "Operations Teams".
- **Kill generic descriptions**: Replace "Standardize workflows across departments" with "Cut onboarding time from 3 days to 4 hours with one documented process."

### P1
- **Add case study links**: Each scenario links to a detailed case study or template preview.
- **Use real metrics**: "47% faster onboarding", "Zero compliance gaps in last audit".

### P2
- Add industry tags (fintech, healthcare, manufacturing) with filter capability.

---

## 7. TESTIMONIALS (`app/page.tsx:315-354`)

### P0
- **Kill auto-rotating carousel**: Remove `setInterval`. Show all 3 testimonials simultaneously.
- **Rewrite names/companies**: Make them specific and believable:
  - "Sarah Chen, Head of Operations, RelayPay (47-person fintech, Austin)"
  - "Marcus Johnson, Quality Manager, MedEquip Logistics (pharma distribution, Newark)"
  - "Elena Rodriguez, Compliance Director, FirstLine Capital ( boutique investment firm, Miami)"
- **Add avatars**: Use `boringavatars.com` or generated abstract portraits. Initials in circles scream fake.

### P1
- **Layout change**: 3-column grid on desktop (all visible). Stack on mobile. No hidden content.
- **Kill giant Quote icon**: Remove decorative `Quote` icon. If needed, use small inline quote mark in text color.
- **Kill dark background template**: Use same background as page (white/light) with subtle card treatment. Or use a very light tinted background (not full slate-900).

### P2
- Add outcome metrics badge per testimonial: "3 weeks → 4 hours" as a small pill.
- Add company logos (even placeholder/generic) below each testimonial for visual credibility.

---

## 8. PRICING (`components/pricing/pricing-section.tsx`)

### P0
- **Kill gradient on Pro card**: Replace `bg-gradient-to-b from-blue-600 to-indigo-700` with solid brand color + subtle border/elevation difference. Use `border-2 border-brand` or a clean `bg-white` with prominent "Popular" badge.
- **Kill amber Sparkles badge**: Replace with simple text badge: "Most Popular" in small caps, subtle background. No amber, no sparkles.
- **Remove scale effect**: Kill `scale-[1.02]` on Pro card. One emphasis technique only.

### P1
- **Add annual/monthly toggle**: Segment control above cards. Show monthly by default, annual with discount. Update prices on toggle.
- **Restructure feature lists**: Use "Everything in [previous tier], plus:" pattern. Group features by category (Create, Export, Manage, Support).
- **Add trust signals**: "Cancel anytime", "No credit card for Free", "SSL secured", small shield/lock icon near CTA.
- **Fix CTA copy**: "Start Free" (Free), "Start with Pro" (Starter → rename to "Team"), "Go Pro" (Pro). Avoid alliteration tongue-twisters.
- **Enterprise section**: Expand from single line to a card: "Need SSO, custom templates, or dedicated support? Contact sales →" with email link.

### P2
- Add testimonial snippet near pricing: "Worth every penny — saved us $15K in consulting."
- Add FAQ mini-section within pricing: "What's included?", "Can I change plans?"

---

## 9. FAQ (`app/page.tsx:362-386`)

### P0
- **Kill "Questions? Answers."**: Replace with "Frequently asked questions" or "Common questions".
- **Expand to 6-8 questions**: Add: "Can my whole team collaborate?", "What happens to my data if I cancel?", "Do you offer onboarding help?", "Can I white-label exported documents?"
- **Rewrite AI-sounding answer**: "Our system leverages advanced LLM capabilities..." → "Stepease uses the same AI technology behind ChatGPT, but we've trained it specifically to ask structured questions and format answers as step-by-step procedures. It won't make assumptions about your industry — it asks until it understands."

### P1
- **Add accordion animation**: Use CSS `grid-template-rows` or Framer Motion `AnimatePresence` for smooth height transition.
- **Add "Still have questions?" CTA**: After last FAQ, add a block: "Can't find your question? Chat with us →" or email link.
- **Categorize questions**: Small tabs or grouped by Billing, Security, Features, Getting Started.

### P2
- Add search/filter for FAQ. Add "Was this helpful?" thumbs up/down per answer.

---

## 10. CTA SECTION (`app/page.tsx:389-430`)

### P1
- **Rewrite headline**: "Ready to Reclaim Your Week?" → "Start documenting what your team actually knows". Product-specific, active.
- **Verify background image**: Ensure `/hero-tech.png` exists. If not, use a solid color overlay or abstract pattern. Remove `mix-blend-multiply` — use simple `bg-slate-900/90` overlay for reliability.
- **Kill consultant comparison**: Remove "$5,000/month consultant—for free." Replace with: "Free forever tier. Upgrade when you need more."

### P1
- **Add social proof**: Below headline, add: "Join 500+ teams" + 5-6 small company logos (grayscale) + 4.8/5 rating with stars.
- **Add secondary action**: Primary = "Create Your First SOP — Free". Secondary = "Watch a 2-min walkthrough" (links to demo section).
- **Simplify benefit pills**: Reduce from 3 to 2: "No credit card required" + "Free forever tier". Or merge into one line.

### P2
- Add urgency element: "Set up in under 2 minutes" with a subtle timer/progress visualization.

---

## 11. FOOTER (`components/layout/footer.tsx`)

### P0
- **Fix dead social links**: Remove `#` hrefs. Either link to real accounts or remove icons entirely. Dead links signal a placeholder product.
- **Expand links**: Add columns: Product (Features, Pricing, Demo, Changelog), Company (About, Blog, Careers, Contact), Resources (Documentation, API, Status, Community), Legal (Privacy, Terms, Security, Cookies).

### P1
- **Add newsletter signup**: "Get product updates — one email a month, no spam." Email input + button in footer.
- **Add app preview**: Small screenshot or product mockup in footer showing the actual app interface.
- **Rewrite description**: "Transform your business processes..." → "Stepease turns team knowledge into structured, shareable documentation. Built for ops teams who are tired of explaining the same thing twice."

### P2
- Add "Backed by" or "Built with" section with technology/partner logos.
- Add language/region selector if applicable.

---

## Implementation Order (Recommended)

**Week 1 (P0 fixes)**:
1. Testimonials — highest trust impact, easiest win
2. Pricing — highest conversion impact
3. Features — breaks the most visible AI pattern

**Week 2 (P1 fixes)**:
4. Stats + Navbar (small, contained changes)
5. Demo framing + How It Works (related, both about flow)
6. Use Cases + FAQ (content-heavy, can be done in parallel)

**Week 3 (P1-P2)**:
7. CTA + Footer (final polish, lower visitor impact)
8. Systemic: design tokens, dark mode consistency, scroll animations across all sections

---

## Design Token Notes (Apply to All Sections)

- Stop using `text-slate-600` + `bg-blue-600` everywhere. Define semantic tokens:
  - `--color-text-secondary` (not hardcoded slate)
  - `--color-accent` (brand primary, use sparingly)
  - `--color-surface-elevated` (for cards, not `bg-white` everywhere)
- Dark mode: every section must have `dark:` variants. Currently inconsistent.
- Animation: use `transform` and `opacity` only. No `width`, `height`, `top`, `left` animations.
- Easing: `cubic-bezier(0.25, 1, 0.5, 1)` (ease-out-quart) for all transitions.
