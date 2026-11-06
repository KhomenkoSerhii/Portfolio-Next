"use client";

import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { works as allWorks, type Work } from "@/lib/data";
import { InView } from "@/components/fx/InView";
import { SplitText } from "@/components/fx/SplitText";
import { Blueprint } from "@/components/motion/Blueprint";
import { DecodeText } from "@/components/motion/DecodeText";
import { DrawnText } from "@/components/motion/DrawnText";
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
        <span key={item} className="text-sm font-medium text-[var(--muted)]">
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
  // where the deck sits on screen when the tour opens, so the tour can grow out of it
  const [origin, setOrigin] = useState<DOMRect | null>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const openTour = (index: number) => {
    setOrigin(deckRef.current?.getBoundingClientRect() ?? null);
    setTour(index);
  };
  const host =
    work.host ?? (work.url ? hostOf(work.url) : work.name.toLowerCase());
  const tourName = work.kind === "product" ? "Product tour" : "Site tour";

  return (
    <article
      className={`grid items-center gap-12 border-b border-[var(--line)] pb-12 pt-4 lg:gap-16 lg:pb-16 lg:pt-6 ${
        flip
          ? "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
          : "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
      }`}
    >
      <div className={`min-w-0 ${flip ? "lg:order-2" : ""}`}>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-[var(--muted)]">
          <span className="font-bold text-[var(--accent-strong)]">
            {kindLabel[work.kind]}
          </span>
          <span>{work.year}</span>
          <span>{work.screens.length} screens</span>
        </div>
        <h3 className="display mt-3 text-4xl leading-[0.98] sm:text-5xl">
          <SplitText text={work.name} by="chars" className="split-rise" />
        </h3>
        <p className="mt-4 text-base font-semibold">{work.role}</p>
        <p className="mt-3 max-w-md text-base leading-snug text-[var(--muted)]">
          {work.description}
        </p>
        <div className="mt-6">
          <Stack items={work.stack} />
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-5">
          <button
            type="button"
            className="button-primary"
            onClick={() => openTour(0)}
          >
            Open {tourName.toLowerCase()}
          </button>
          {work.url ? (
            <a
              href={work.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`Visit ${work.name} (opens in a new tab)`}
              className="text-link"
            >
              Visit site ↗
            </a>
          ) : null}
        </div>
      </div>

      <div
        ref={deckRef}
        className={`fx-curtain min-w-0 ${flip ? "lg:order-1" : ""}`}
      >
        <ScreenDeck
          name={work.name}
          host={host}
          screens={work.screens}
          onOpen={openTour}
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
            origin={origin}
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
    <section id="portfolio" className="section-shell section-pad">
      <Blueprint className="section-heading">
        <div>
          <h2 data-bp-box>
            <DrawnText>Real screens from products I shipped.</DrawnText>
          </h2>
        </div>
        <p
          className="max-w-md text-lg leading-snug text-[var(--muted)]"
          data-bp-box
          style={{ "--i": 1 } as React.CSSProperties}
        >
          <DecodeText
            delay={700}
            text="Products and client sites I built from design to deployment. Open a tour and look at the details yourself."
          />
        </p>
      </Blueprint>

      {works.map((work, index) => (
        <InView key={work.name} className="mt-10">
          <Showcase work={work} flip={index % 2 === 1} />
        </InView>
      ))}
    </section>
  );
}
