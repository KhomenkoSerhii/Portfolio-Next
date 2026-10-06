"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile, recommendations } from "@/lib/data";
import { Reveal } from "@/components/ui/Reveal";

function Initials({ name }: { name: string }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--line-strong)] font-display text-xs font-extrabold">
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
    <section id="reviews" className="section-shell section-pad content-auto">
      <Reveal>
        <div className="section-heading">
          <div>
            <p className="section-index">04 / REFERENCES</p>
            <h2>What the people I shipped with say.</h2>
          </div>
          <div className="max-w-md md:pt-3">
            <p className="text-base leading-relaxed text-[var(--muted)]">
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

      <div className="mt-14 grid border-y border-[var(--line-strong)] lg:grid-cols-[0.68fr_0.32fr]">
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
              <span className="font-display text-8xl font-extrabold leading-[0.6] text-[var(--accent-strong)]">
                “
              </span>
              <blockquote className="mt-7 whitespace-pre-line [overflow-wrap:anywhere] font-display text-2xl font-bold leading-[1.14] tracking-[-0.035em] sm:text-4xl lg:text-[2.7rem]">
                {recommendation.quote}
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-4 pt-12">
                <Initials name={recommendation.name} />
                <div>
                  <p className="font-semibold">{recommendation.name}</p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
                    {recommendation.role} · Via LinkedIn
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
                <span className={`font-mono text-[9px] ${selected ? "text-[var(--accent-strong)]" : "text-[var(--muted)]"}`}>
                  0{index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{item.name}</span>
                  <span className="mt-0.5 block truncate text-xs text-[var(--muted)]">
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
