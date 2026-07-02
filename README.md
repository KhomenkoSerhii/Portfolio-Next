# Serhii Khomenko — Portfolio

One-page portfolio with a scroll-driven 3D background and an AI assistant that
answers questions about the CV.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 ·
Framer Motion · React Three Fiber / drei · Anthropic Claude API

## Getting started

```bash
npm install
cp .env.local.example .env.local   # add your ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000.

The AI chat widget requires `ANTHROPIC_API_KEY` (get one at
https://platform.claude.com). Everything else works without it.

## Project structure

```
app/
  api/chat/route.ts     # streaming chat endpoint (Claude + prompt caching)
  layout.tsx            # fonts, global metadata (SEO/OG)
  page.tsx              # page assembly + JSON-LD
  globals.css           # theme tokens, keyframes, global styles
  icon.svg              # favicon; apple-icon/opengraph-image generated via next/og
  sitemap.ts robots.ts manifest.ts
components/
  layout/               # Navbar (scroll-spy, mobile hamburger)
  sections/             # Hero, Experience, Skills, Projects, Contact
  three/                # GlobalScene (scroll-driven 3D), SceneMount (client-only)
  chat/                 # ChatWidget (streaming AI assistant)
  ui/                   # Reveal/SectionTitle, Magnetic — shared primitives
lib/
  data.ts               # all CV content (single source of truth)
  site.ts               # site URL + SEO strings
```

## Editing content

- **CV data** (experience, skills, projects, links): `lib/data.ts` — the page
  and the AI assistant both read from it.
- **Domain / SEO strings**: `lib/site.ts` — set `SITE_URL` (or
  `NEXT_PUBLIC_SITE_URL` env) to the production domain before deploying.
- **3D choreography**: `KEYFRAMES` array at the top of
  `components/three/GlobalScene.tsx` (position / scale / dissolve / spin per
  scroll position).

## Deploying

```bash
npm run build   # verifies types + prerenders static routes
```

Deploy to Vercel (or any Node host). Remember to set `ANTHROPIC_API_KEY` and
`NEXT_PUBLIC_SITE_URL` in the environment, then submit `/sitemap.xml` to
Google Search Console.
