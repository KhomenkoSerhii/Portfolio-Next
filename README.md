# Serhii Khomenko — Portfolio

Editorial "Proof of Work" portfolio with live GitHub contribution data, a 3D
activity terrain, production case studies, and an AI assistant that answers
questions about the CV.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 ·
Framer Motion · React Three Fiber / drei · Anthropic Claude API

## Getting started

```bash
npm install
cp .env.local.example .env.local   # add your ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000.

The AI chat widget requires one configured model provider. GitHub activity works
without credentials from the public profile; an optional `GITHUB_TOKEN` switches
the data source to GitHub's official GraphQL API.

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
  sections/             # Case studies, GitHub activity, experience, reviews, contact
  three/                # Contribution terrain + deferred client-only mount
  chat/                 # ChatWidget (streaming AI assistant)
  ui/                   # Reveal/SectionTitle, Magnetic — shared primitives
lib/
  data.ts               # CV and case-study content (single source of truth)
  github.ts             # cached GitHub contribution data + resilient fallback
  site.ts               # site URL + SEO strings
```

## Editing content

- **CV data** (experience, skills, projects, links): `lib/data.ts` — the page
  and the AI assistant both read from it.
- **Domain / SEO strings**: `lib/site.ts` — set `SITE_URL` (or
  `NEXT_PUBLIC_SITE_URL` env) to the production domain before deploying.
- **GitHub activity**: `lib/github.ts` caches the public contribution calendar
  for six hours. Add `GITHUB_TOKEN` to use the authenticated GraphQL source.
- **3D terrain**: `components/three/GlobalScene.tsx`; the lightweight CSS
  fallback lives in `components/three/SceneMount.tsx` for reduced capability
  and non-WebGL browsers.

## Deploying

```bash
npm run build   # verifies types + prerenders static routes
```

Deploy to Vercel (or any Node host). Set an AI provider key and
`NEXT_PUBLIC_SITE_URL`; `GITHUB_TOKEN` is optional. Then submit `/sitemap.xml`
to Google Search Console.
