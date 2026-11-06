# Visual redesign - design

## Goal
Remove the generic AI-generated look from the site and make light the default theme. Copy and section order stay as they are. Chosen from three browser mockups: direction C, "Expressive product".

## Type
- Mona Sans only, loaded through `next/font/google` with the `wdth` axis. Syne, Geist and Geist Mono are gone.
- `.display` is the single headline voice: 125% width, weight 800 or 900, sentence case.
- No monospace, no all-caps, no wide letter-spacing. Body text is at least 16px and secondary text at least 14px, except labels inside the decorative hero visual and browser frames.

## Colour
- Light: background `#efefeb`, text `#0e0e0e`, muted `#5c5c58`, accent `#f2401b`.
- `--accent-strong` (`#b02c0d` light, `#ff7350` dark) is for small accent text, because `#f2401b` on the light background only reaches 3.3:1. That passes for large text only.
- `.on-accent` and `.on-ink` hold the orange and black sections to one palette in both themes.

## Theme
Two themes: Blue Hour (the default) and Dark. One navbar button switches between them, and the choice is restored from `localStorage`. The orange Light theme was retired on 2026-11-06; a saved "light" falls back to Blue Hour. The default lives in `lib/theme/ThemeProvider.tsx` and the anti-flash script in `app/layout.tsx`.

## Blue Hour theme
The default theme. It uses the Calyptus product palette, weighted to blue: navy `#03092d`, royal `#0c30ad`, electric `#0847f7`, sky `#6db3ff`, as a gradient on the quote, contact and first metric blocks, the primary buttons, the headline and the section rules. Button border animations are sky blue. Green `#02b140` is only the live status dots. Surfaces that differ per theme go through `--accent-ink`, `--accent-surface` and `--signal`.

## Animations
Every existing animation stays and only changes colour: button border chase, gradient sweep, hover lifts, reveals, the 3D stack, the pulse dot, the scanline, scroll progress, the capability cell hover. This overrides the mockup, which dropped them.

## Removed
Section numbering ("01 / EXPERIENCE"), small mono labels, the background grid, list numbering in the mobile menu and references, the "@" watermark, and the "Contact form / 01", "Ready" and "Transmission received" labels. Arrows stay only on links that leave the site and on tour Prev/Next.

## Layout
Sections are recomposed to match the mockup: a full-width hero headline with the stack visual beside the copy, metric blocks, a full-bleed orange quote, ruled experience rows with stack chips, and alternating large capability rows on black.

## Also fixed
`content-visibility: auto` is removed from sections that nav links target. It made anchor jumps stop thousands of pixels short, because the browser scrolled using estimated section heights.

## Out of scope
Unused components that `app/page.tsx` does not render: `Services`, `InterfaceLab`, `GitHubActivity`, `ContributionSkyline`, `ChatWidget`, `EasterEggs`. They keep their old classes.

## Testing
Unit tests cover the light default, restoring a saved dark preference, and the toggle. Visual checks use browser renders at 1440 and 390 wide in both themes, plus measured nav landing positions.
