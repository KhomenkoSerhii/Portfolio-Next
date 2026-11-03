"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile, recommendations } from "@/lib/data";
import { Reveal } from "@/components/ui/Reveal";

function Initials({ name }: { name: string }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-[var(--foreground)] text-sm font-extrabold">
      {name
        .split(" ")
        .map((word) => word[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}

export default function Recommendations() {
  const initial = Math.max(
    recommendations.findIndex((recommendation) => recommendation.featured),
    0
  );
  const [active, setActive] = useState(initial);
  const recommendation = recommendations[active];

  return (
    <section id="reviews" className="section-shell section-pad">
      <Reveal>
        <div className="section-heading">
          <div>
            <h2>What the people I shipped with say.</h2>
          </div>
          <div className="max-w-md">
            <p className="text-lg leading-snug text-[var(--muted)]">
              Recommendations from founders and engineers who worked beside me
              through launches, pivots, legacy systems, and production pressure.
            </p>
            <a
              href={`${profile.links.linkedin}/details/recommendations/`}
              target="_blank"
              rel="noreferrer"
              className="button-secondary button-inline mt-5"
            >
              <span>All recommendations</span>
              <span aria-hidden="true" className="shrink-0">↗</span>
            </a>
          </div>
        </div>
      </Reveal>

      <div className="grid border-b-4 border-[var(--foreground)] lg:grid-cols-[0.68fr_0.32fr]">
        <div className="min-h-[34rem] min-w-0 py-9 pr-0 lg:border-r lg:border-[var(--line-strong)] lg:py-14 lg:pr-16">
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              key={recommendation.name}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="flex h-full flex-col"
            >
              <span className="display text-8xl leading-[0.6] text-[var(--accent)]" aria-hidden>
                “
              </span>
              <blockquote className="mt-7 whitespace-pre-line [overflow-wrap:anywhere] text-2xl font-medium leading-[1.16] tracking-[-0.02em] sm:text-4xl lg:text-[2.7rem]">
                {recommendation.quote}
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-4 pt-12">
                <Initials name={recommendation.name} />
                <div>
                  <p className="font-semibold">{recommendation.name}</p>
                  <p className="mt-0.5 text-sm text-[var(--muted)]">
                    {recommendation.role}, via LinkedIn
                  </p>
                </div>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="min-w-0 border-t border-[var(--line-strong)] lg:border-t-0">
          {recommendations.map((item, index) => {
            const selected = index === active;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => setActive(index)}
                aria-pressed={selected}
                className={`group flex w-full cursor-pointer items-center gap-4 border-b border-[var(--line)] px-0 py-5 text-left transition lg:px-7 ${
                  selected
                    ? "bg-[var(--accent-soft)]"
                    : "hover:bg-[var(--surface)]"
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{item.name}</span>
                  <span className="mt-0.5 block truncate text-sm text-[var(--muted)]">
                    {item.role}
                  </span>
                </span>
                <span className={`text-lg transition ${selected ? "translate-x-0 text-[var(--accent-strong)]" : "-translate-x-1 text-[var(--muted)] group-hover:translate-x-0"}`}>
                  →
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
