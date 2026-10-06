# Repositioning + portfolio grid - design

## Goal
Reposition the site from "Senior Frontend Engineer" to a product-minded, frontend-heavy full-stack engineer, add a data-driven portfolio grid for shipped (mostly freelance) sites, and tighten the layout so a recruiter gets role, proof and contact within ~30 seconds. Primary audience: recruiters and hiring managers (full-time or contract); freelance clients are secondary.

Visual identity stays (dark/lime palette, display font, grid background, case-study UI mockups). This is an evolution, not a redesign.

## Positioning
- Role line (`profile.role`, hero, LinkedIn headline): `Senior Software Engineer · Product-minded Full-Stack (Frontend-heavy) · React · Next.js · Node.js · TypeScript · AI/LLM · Remote`
- Short title (`SITE_NAME`, OG image, JSON-LD `jobTitle`, navbar label): `Senior Software Engineer`
- Source of truth for copy: `Serhii_Khomenko_Software_Engineer_React_Node.pdf`. Backend claims match that CV exactly (Calyptus: "contributed to Node.js backend tasks"; StarApps: "built and maintained Node.js REST APIs"). No stronger claims than the CV makes.
- The CV PDFs themselves are not changed.

## Changes

### Copy and metadata
- `lib/site.ts`: new `SITE_NAME`, `SITE_DESCRIPTION`.
- `lib/data.ts`: `profile.role`, `profile.summary` (from CV summary), new `profile.cvUrl`. Experience highlights/stacks merged with the CV's backend bullets (Calyptus adds Node.js, OpenAI API, AWS; StarApps leads with the Node.js bullet).
- `app/layout.tsx` keywords: add Software Engineer, Full-Stack Engineer, Product Engineer, Node.js; drop "Frontend Developer" as the lead term.
- `app/page.tsx` JSON-LD: `jobTitle`, expanded `knowsAbout` (REST APIs, MongoDB, Socket.IO).
- `app/opengraph-image.tsx`, `app/api/chat/route.ts` system prompt, `Navbar` label, `Contact` intro: same wording.

### Hero
- H1 states the role: "Senior / Software / Engineer." (accent on the middle line).
- A mono subline under it with "Product-minded full-stack, frontend-heavy" plus the core stack.
- CTAs: "View work", "Download CV" (`/cv/Serhii_Khomenko_Software_Engineer.pdf`), "LinkedIn".
- Metrics: 7+ years shipping · 100K+ users served · ~35% faster apps · React + Node full-stack.

### Density
- `.section-heading h2`: from `clamp(2.6rem, 6.4vw, 5.8rem)` down to roughly `clamp(2.1rem, 4.4vw, 3.9rem)`, with `max-width` widened so headings fit in 1-2 lines.
- `.section-pad`: from `clamp(6rem, 11vw, 10rem)` to roughly `clamp(4.5rem, 8vw, 7.5rem)`.
- Shorter section headlines. Target: ~30% shorter page.

### Section order and nav
Order: Hero → Work (case studies) → Portfolio → Experience → Capabilities → Reviews → Activity → Contact.
Nav: Work, Portfolio (only when there are entries), Experience, Skills, Reviews, Contact. Activity stays on the page but leaves the nav.

### Capabilities
There are four cards:
1. Frontend architecture
2. Backend & APIs (Node.js REST APIs, business logic, MongoDB, Socket.IO, payments and third-party integrations, AWS, CI/CD)
3. AI product UX
4. Real-time & performance (the former C and D merged)

The core stack index becomes: React, TypeScript, Next.js, Node.js, REST / GraphQL, MongoDB, Socket.IO, AI / LLM, Stripe, AWS / CI-CD.

### Portfolio grid (new)
- Data lives in `lib/data.ts`:
  - `export type Work = { name; url?; image; role; description; stack: string[]; kind: "freelance" | "product" | "side"; year: string }`
  - `export const works: Work[] = []`, empty until real sites and screenshots arrive.
- Screenshots go in `public/works/<slug>.(png|jpg|webp)`, at 16:10 (e.g. 1600x1000).
- Component: `components/sections/Portfolio.tsx`, `id="portfolio"`. It takes a `works` prop that defaults to the data export and returns `null` when the list is empty.
- Card: a browser-chrome frame holding a `next/image` (`fill`, `sizes`, `object-cover object-top`), below it name, kind · year, role, a short description and stack tags, and "Visit site ↗" when `url` is set. Grid is 1 column on mobile and 2 from `md`.
- Images come from local `/public` only, so the CSP `img-src 'self'` is unchanged.

### CV download
Copy `~/Desktop/Docs/MyCV/rework/Serhii_Khomenko_Software_Engineer_React_Node.pdf` to `public/cv/Serhii_Khomenko_Software_Engineer.pdf`. The PDF exposes the CV email publicly, which is intended because it is the public CV.

## Testing
- `lib/data.test.ts`: validate every `works` entry (fields, kind, image path under `/works/`, url is http(s) if present).
- `components/sections/Portfolio.test.tsx`: renders nothing for `[]`; renders a card, link and image alt for one entry.
- Existing tests stay green. Run `npm run test:run`, `npm run lint`, `npm run build`.
- Visual check through Playwright screenshots at desktop and mobile widths, in both themes.

## Out of scope
- Changing the CV PDFs.
- New palette or fonts.
- The unused `Services` and `InterfaceLab` sections.
