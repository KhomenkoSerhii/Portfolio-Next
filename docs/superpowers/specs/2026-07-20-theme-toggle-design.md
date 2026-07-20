# Theme toggle (light/dark) — design

## Goal
Add a light/dark theme switcher at the top of the site (in `Navbar`). Default theme is **light**. Currently the entire site is hardcoded to a single dark theme (zinc-950/black backgrounds, white text) across 8 components with no CSS variables or `dark:` variants.

## Scope
Full light theme: every visible component gets light-mode styling plus a `dark:` variant of its current dark styling. Affected files:
- `app/layout.tsx`, `app/globals.css`
- `components/layout/Navbar.tsx` (+ new toggle button)
- `components/sections/Hero.tsx`
- `components/sections/Skills.tsx`
- `components/sections/Experience.tsx`
- `components/sections/Recommendations.tsx`
- `components/sections/Services.tsx`
- `components/sections/Contact.tsx`
- `components/chat/ChatWidget.tsx`
- `components/easter/EasterEggs.tsx`

## Architecture

**State management:** custom React Context (`lib/theme/ThemeProvider.tsx`), no third-party theme library — avoids compatibility risk with the pre-release Next.js APIs already in use in this repo.

- `ThemeProvider` holds `theme: "light" | "dark"` and a `toggleTheme()` function.
- On mount, reads `localStorage.getItem("theme")`; if absent, falls back to `"light"` (never reads `prefers-color-scheme` — explicit product decision: default is always light regardless of OS setting).
- Every theme change writes to `localStorage` and toggles the `dark` class on `document.documentElement`.
- `useTheme()` hook exposes `{ theme, toggleTheme }` to client components.

**Flash prevention:** a small inline `<script>` placed in `app/layout.tsx`'s `<head>`, running before hydration, reads `localStorage.getItem("theme")` and sets `document.documentElement.classList.add("dark")` synchronously if it's `"dark"`. This avoids a flash of the wrong theme on load. No-op (stays light) if the key is absent or invalid.

**Tailwind v4 dark variant:** Tailwind v4 defaults to `prefers-color-scheme` for `dark:`. Add to `globals.css`:
```css
@custom-variant dark (&:where(.dark, .dark *));
```
This switches `dark:` to be driven by the `.dark` class on `<html>` instead of OS preference.

**CSS variables:** `--background`/`--foreground` in `:root` become light values; a `.dark` block overrides them to the current dark values (`#090c0a` / `#eaf0ed`).

## Color mapping (light theme)
Same graphic language, inverted, emerald accent unchanged:
- Background: `white` / `zinc-50` (was `zinc-950` / `bg-black`)
- Primary text: `zinc-900` (was `white`)
- Secondary/muted text: `zinc-500` (was `zinc-400`)
- Borders/dividers: `zinc-200` (was `zinc-900/zinc-800`)
- Accent (links, active states, highlights): unchanged `emerald-400`/`emerald-500` family
- Card/surface backgrounds: `zinc-100` or `white` with `zinc-200` border (was `zinc-900`/`zinc-950` with `zinc-800` border)

Each component keeps its existing dark classes and gets the light equivalents as the base (unprefixed) classes, with the current dark classes moved behind `dark:`.

## Toggle UI
Sun/moon icon button in `Navbar`, positioned at the start of the nav bar area (top of page, alongside the logo/links). Click toggles theme with a small icon-swap transition (reuse existing `framer-motion` `AnimatePresence` pattern already used elsewhere in `Navbar.tsx` for consistency). Accessible via `aria-label` reflecting the action ("Switch to dark theme" / "Switch to light theme").

## Out of scope
- No system-preference sync (explicit default-light requirement overrides it).
- No per-section theme overrides — one global theme for the whole page.
- No new dependencies.
