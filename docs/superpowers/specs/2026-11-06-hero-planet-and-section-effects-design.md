# Hero planet and section effects - design

Replaces an uncommitted motion rework (decoded text, drawn titles, blueprint outlines) and the CSS 3D stack in the hero. All of it was chosen in browser mockups in `.superpowers/brainstorm/` (`hero-figures.html` and `swarm-effects.html`).

## Hero
- The full-height hero shows a 3D figure drawn as text (an ASCII grid), and a lens that follows the pointer to show the same figure as a real render.
- **Figure:** Earth only (a chip and a glass React atom were built and then dropped on request).
  - **Earth:** day and night come from the real sun position at the current UTC time, with city lights on the night side, clouds, ocean glint and a rim glow. Syntax-highlighted code (One Dark colours) streams along arcs from Lviv to Berlin, London, Amsterdam, Paris, Warsaw, Stockholm, Lisbon, New York, San Francisco and Tel Aviv. Faint background traffic arcs and a green Lviv marker are added.
- **Controls** are segmented buttons with `aria-pressed`:
  - time (Earth): Now, or 24h in 20s;
  - render mode: ASCII, Binary, Blocks.
  - Defaults are Now and ASCII. The theme comes from the site toggle; Blue Hour is light.
- **Chrome around the figure:**
  - a mono top line with `Lviv HH:MM · day|twilight|night` for Earth (or the figure's label), and `Live · 14px · N fps`;
  - a live log on the left, desktop only, `aria-hidden`;
  - the H1 "Built from zero. Still in production." stays real server-rendered text, followed by View work, Download CV and LinkedIn. The name line, the pitch sentence and the figure captions were dropped from the hero on request.
- The metric blocks (7+, 100K+, 100+, 0 to 1) move to a strip right under the hero and count up.
- **Intro:** the hero opens on a clean screen; the title draws itself as a blueprint (grid, dashed outline, outlined letters, then the fill); after about 2.3s the planet, the top line, the log, the buttons and the controls fade in, staggered.
- **Interaction:**
  - Pointer moves the lens; dragging turns the figure.
  - With no pointer, the lens drifts by itself. Phones get a smaller lens that also follows a finger.
- **Performance:**
  - three.js is loaded with `import()` after hydration.
  - The loop pauses when the hero is off screen or the tab is hidden.
  - The ASCII grid reads a cols×rows render target each frame.
  - Pixel ratio is capped at 2 for the lens render.
- **Textures:** the Earth day, night and bump/roughness/cloud maps are self-hosted in `public/textures/` as 2048×1024 WebP. They are derived from the three.js example textures (NASA imagery).
- **Fallbacks:**
  - **No WebGL:** the hero shows the title and copy on the theme background, without controls.
  - **Reduced motion:** one still frame, a still lens and no log.

## Section effects
Each section gets its own entrance, played once when it scrolls in, unless the effect is scroll-scrubbed.

| Section | Effect |
| --- | --- |
| Pull quote | Dan Jones's recommendation, word for word. Sticky block; words light up with the scroll; the particle swarm forms big quotation marks behind it. |
| Experience | A git line draws down the left; each role slides in when the line reaches its commit node. Each role shows a short commit label. |
| Portfolio | Product name letters rise; the deck opens like a curtain and settles from a slight zoom. |
| Skills | The section grows from a rounded inset to full bleed as it enters; capability titles slide in from alternating sides (scrubbed); stack chips spring in. The particle swarm forms the "interface → API → database" figure behind it. |
| Recommendations | Quote words come into focus from a blur. |
| GitHub | Calendar cells wave in diagonally; stat numbers count up. |
| Contact | The section grows from an inset like Skills; heading letters rise; the particle swarm forms a paper plane; the submit button is magnetic. |

- **Split text:** where text is split into words or letters, the original string is the element's accessible name, and the pieces are `aria-hidden`.
- **Reduced motion:** every effect is replaced by the final state.

## Headings
Section titles and their intro lines keep the blueprint entrance from the first motion pass: a grid and dashed outlines, then the title is traced as an outline and filled (`DrawnText`), and the intro line resolves out of random glyphs (`DecodeText`). The hero title uses the same drawing.

## Removed
- The `motion-ready` class: hidden-before-entrance states now sit under `html.js`, which the inline script removes again if the app hasn't hydrated within 4 seconds.
- `components/visuals/StackLayers`.
- The swarm on any section other than the pull quote, Skills and Contact.

## Testing
- **Unit tests:**
  - subsolar point: declination on 2026-11-06 is about −16°, and the June solstice is about +23.4°;
  - code tokenizer: keywords, strings, numbers, functions and tags get their colours;
  - the hero renders the H1, the role and the three control groups with Earth, Now and ASCII pressed, and falls back cleanly without WebGL;
  - split-text components keep the full sentence as the accessible name.
- **Browser renders:** 1440 and 390, Blue Hour and Dark, for the hero and each section.
- **Checks:** `tsc`, `eslint`, `vitest`, `next build`.

## Plan
1. Textures, plus the pure helpers with tests: `lib/hero/sun.ts` and `lib/hero/code-tokens.ts`.
2. The scene module `components/hero/scene/` (renderer, ASCII pass, the three figures, the code ribbons), and `components/hero/HeroStage.tsx` (canvases, lens, log, controls). Rewrite `Hero.tsx`.
3. `components/visuals/Swarm.tsx` (network and plane figures), mounted in Skills and Contact.
4. The section effects: an `useInViewOnce` hook, `ScrollWords`, `GitTimeline`, `SplitText`, `CountUp`, and the CSS for curtain, cells, spring and inset sections.
5. Remove the old motion code, tune visually, and verify.
