"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { works as allWorks, type Work, type WorkScreen } from "@/lib/data";
import { Reveal } from "@/components/ui/Reveal";
import { ScreenDeck } from "./portfolio/ScreenDeck";
import { ProductTour } from "./portfolio/ProductTour";

const kindLabel: Record<Work["kind"], string> = {
  freelance: "Freelance",
  product: "Product",
  side: "Side project",
};

function hostOf(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function Stack({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1.5">
      {items.map((item) => (
        <span key={item} className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
          + {item}
        </span>
      ))}
    </div>
  );
}

// a product with a screen set: fanned deck in the section, full tour on click
function Showcase({ work, screens }: { work: Work; screens: WorkScreen[] }) {
  const [tour, setTour] = useState<number | null>(null);
  const host = work.host ?? (work.url ? hostOf(work.url) : work.name.toLowerCase());

  return (
    <article className="grid items-center gap-12 border-b border-[var(--line)] pb-12 pt-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:pb-16 lg:pt-6">
      <div className="min-w-0">
        <div className="flex items-center gap-4 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--muted)]">
          <span className="text-[var(--accent-strong)]">{kindLabel[work.kind]}</span>
          <span>{work.year}</span>
          <span>{screens.length} screens</span>
        </div>
        <h3 className="mt-4 font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-[-0.05em] sm:text-5xl">
          {work.name}
        </h3>
        <p className="mt-4 text-sm text-[var(--foreground)]/80">{work.role}</p>
        <p className="mt-4 max-w-md text-sm leading-[1.75] text-[var(--muted)]">{work.description}</p>
        <div className="mt-6">
          <Stack items={work.stack} />
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-5">
          <button type="button" className="button-primary" onClick={() => setTour(0)}>
            Open product tour
          </button>
          {work.url ? (
            <a
              href={work.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`Visit ${work.name} (opens in a new tab)`}
              className="text-link font-mono text-[10px] uppercase tracking-[0.16em] transition-colors hover:text-[var(--accent-strong)]"
            >
              Visit site ↗
            </a>
          ) : null}
        </div>
      </div>

      <div className="min-w-0">
        <ScreenDeck name={work.name} host={host} screens={screens} onOpen={setTour} suspended={tour !== null} />
      </div>

      <AnimatePresence>
        {tour !== null ? (
          <ProductTour
            name={work.name}
            host={host}
            screens={screens}
            index={tour}
            onIndexChange={setTour}
            onClose={() => setTour(null)}
          />
        ) : null}
      </AnimatePresence>
    </article>
  );
}

function WorkCard({ work }: { work: Work }) {
  return (
    <article className="group flex w-full min-w-0 flex-col">
      <div className="overflow-hidden border border-[var(--line-strong)] bg-[var(--surface)] transition-colors group-hover:border-[var(--accent)]">
        <div className="flex h-8 items-center gap-3 border-b border-[var(--line)] px-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--line-strong)]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--line-strong)]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          </div>
          <span className="min-w-0 truncate font-mono text-[8px] tracking-[0.16em] text-[var(--muted)]">
            {work.url ? hostOf(work.url) : work.name.toLowerCase()}
          </span>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={work.image}
            alt={`${work.name} website screenshot`}
            fill
            sizes="(min-width: 1280px) 620px, (min-width: 768px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--muted)]">
        <span className="text-[var(--accent-strong)]">{kindLabel[work.kind]}</span>
        <span>{work.year}</span>
      </div>
      <h3 className="mt-3 font-display text-2xl font-extrabold uppercase leading-[1.05] tracking-[-0.04em]">
        {work.name}
      </h3>
      <p className="mt-2 text-sm text-[var(--foreground)]/80">{work.role}</p>
      <p className="mt-3 text-sm leading-[1.7] text-[var(--muted)]">{work.description}</p>

      <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-5">
        <Stack items={work.stack} />
        {work.url ? (
          <a
            href={work.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Visit ${work.name} (opens in a new tab)`}
            className="text-link shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors hover:text-[var(--accent-strong)]"
          >
            Visit site ↗
          </a>
        ) : null}
      </div>
    </article>
  );
}

export default function Portfolio({ works = allWorks }: { works?: Work[] }) {
  if (works.length === 0) return null;
  const showcases = works.filter((work) => work.screens?.length);
  const cards = works.filter((work) => !work.screens?.length);

  return (
    <section id="portfolio" className="section-shell section-pad content-auto">
      <Reveal>
        <div className="section-heading">
          <div>
            <p className="section-index">02 / PORTFOLIO</p>
            <h2>Real screens from products I shipped.</h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-[var(--muted)] md:pt-3">
            Products and client sites I built from design to deployment. Open a
            tour and look at the details yourself.
          </p>
        </div>
      </Reveal>

      {showcases.map((work) => (
        <Reveal key={work.name} className="mt-10">
          <Showcase work={work} screens={work.screens ?? []} />
        </Reveal>
      ))}

      {cards.length > 0 ? (
        <div className="mt-14 grid gap-x-10 gap-y-16 md:grid-cols-2">
          {cards.map((work, index) => (
            <Reveal key={work.name} delay={(index % 2) * 0.06} className="flex">
              <WorkCard work={work} />
            </Reveal>
          ))}
        </div>
      ) : null}
    </section>
  );
}
