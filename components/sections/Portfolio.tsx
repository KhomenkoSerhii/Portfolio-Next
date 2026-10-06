"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { works as allWorks, type Work } from "@/lib/data";
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

// every work gets the same treatment: fanned screen deck in the section, full tour on click.
// `flip` puts the deck on the left so consecutive works alternate sides.
function Showcase({ work, flip }: { work: Work; flip: boolean }) {
  const [tour, setTour] = useState<number | null>(null);
  const host = work.host ?? (work.url ? hostOf(work.url) : work.name.toLowerCase());
  const tourName = work.kind === "product" ? "Product tour" : "Site tour";

  return (
    <article
      className={`grid items-center gap-12 border-b border-[var(--line)] pb-12 pt-4 lg:gap-16 lg:pb-16 lg:pt-6 ${
        flip ? "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]" : "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
      }`}
    >
      <div className={`min-w-0 ${flip ? "lg:order-2" : ""}`}>
        <div className="flex items-center gap-4 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--muted)]">
          <span className="text-[var(--accent-strong)]">{kindLabel[work.kind]}</span>
          <span>{work.year}</span>
          <span>{work.screens.length} screens</span>
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
            Open {tourName.toLowerCase()}
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

      <div className={`min-w-0 ${flip ? "lg:order-1" : ""}`}>
        <ScreenDeck
          name={work.name}
          host={host}
          screens={work.screens}
          onOpen={setTour}
          suspended={tour !== null}
        />
      </div>

      <AnimatePresence>
        {tour !== null ? (
          <ProductTour
            name={work.name}
            label={tourName}
            host={host}
            screens={work.screens}
            index={tour}
            onIndexChange={setTour}
            onClose={() => setTour(null)}
          />
        ) : null}
      </AnimatePresence>
    </article>
  );
}

export default function Portfolio({ works = allWorks }: { works?: Work[] }) {
  if (works.length === 0) return null;

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

      {works.map((work, index) => (
        <Reveal key={work.name} className="mt-10">
          <Showcase work={work} flip={index % 2 === 1} />
        </Reveal>
      ))}
    </section>
  );
}
