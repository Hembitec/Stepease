# Design

## Visual Theme
Minimalist, high-contrast, and expert. The UI uses a clean slate/blue color strategy that avoids the typical SaaS "neon" accents, favoring structural clarity and functional aesthetics.

## Color Palette
Using OKLCH tokens for perceptual uniformity.
- **Background:** `oklch(1 0 0)` (Light) / `oklch(0.145 0 0)` (Dark)
- **Primary:** `oklch(0.205 0 0)` (Light) / `oklch(0.985 0 0)` (Dark)
- **Accents:** `oklch(0.97 0 0)` (Light) - Very subtle tints for cards and sections.
- **Destructive:** `oklch(0.577 0.245 27.325)` (Red)

## Typography
- **Heading/Sans:** "Familjen Grotesk" — A geometric sans-serif that provides a modern, confident feel.
- **Body:** System sans-serif for high legibility.
- **Mono:** UI Monospace for SOP content and technical details.

## Components
- **Cards:** Rounded-xl (0.625rem) with subtle borders (`--border`). No heavy shadows.
- **Buttons:** Clean, solid primary buttons or outlined secondary buttons.
- **Badges:** Small, uppercase, semi-bold for version numbers (v1, v2) and statuses.

## Layout
- **Container:** Max-width 4xl to 6xl for readability.
- **Spacing:** Generous whitespace between sections to reduce cognitive load.
- **Rhythm:** Staggered layouts in marketing; structured grids/lists in the app.
