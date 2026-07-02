"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile, recommendations } from "@/lib/data";
import { Reveal, SectionTitle } from "@/components/ui/Reveal";

function Initials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-emerald-500 font-display text-sm font-bold text-zinc-950">
      {initials}
    </span>
  );
}

function Author({
  name,
  role,
  relation,
}: {
  name: string;
  role: string;
  relation: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Initials name={name} />
      <div>
        <p className="font-semibold text-white">{name}</p>
        <p className="font-mono text-xs text-zinc-500">{role}</p>
        <p className="font-mono text-[10px] tracking-wider text-emerald-500/80">
          {relation.toUpperCase()} · VIA LINKEDIN
        </p>
      </div>
    </div>
  );
}

export default function Recommendations() {
  const [active, setActive] = useState(
    Math.max(recommendations.findIndex((r) => r.featured), 0)
  );
  const featured = recommendations[active];
  const rest = recommendations.filter((_, i) => i !== active);

  return (
    <section id="recommendations" className="mx-auto max-w-5xl px-6 py-28">
      <SectionTitle index="03 – WHAT PEOPLE SAY">Recommendations</SectionTitle>

      {/* featured quote – content crossfades when a card below is clicked */}
      <Reveal>
        <figure className="relative min-h-[16rem] border-l-2 border-emerald-400 pl-6 sm:pl-10">
          <span
            aria-hidden
            className="pointer-events-none absolute -left-3 -top-8 font-display text-8xl font-extrabold text-emerald-500/20"
          >
            “
          </span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={featured.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <blockquote className="whitespace-pre-line text-lg leading-relaxed text-zinc-200 sm:text-xl sm:leading-relaxed">
                {featured.quote}
              </blockquote>
              <figcaption className="mt-6">
                <Author {...featured} />
              </figcaption>
            </motion.div>
          </AnimatePresence>
        </figure>
      </Reveal>

      {/* the rest – click to read in full above */}
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {rest.map((rec) => {
          const index = recommendations.indexOf(rec);
          return (
            <Reveal key={rec.name}>
              <motion.figure
                role="button"
                tabIndex={0}
                aria-label={`Read ${rec.name}'s recommendation in full`}
                onClick={() => setActive(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActive(index);
                  }
                }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="flex h-full cursor-pointer flex-col rounded-2xl border border-zinc-800/80 bg-zinc-950/80 p-6 backdrop-blur-md transition-colors hover:border-emerald-500/40 focus-visible:border-emerald-400 focus-visible:outline-none"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={rec.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-1 flex-col"
                  >
                    <blockquote className="flex-1 overflow-hidden text-sm leading-relaxed text-zinc-200 [-webkit-box-orient:vertical] [-webkit-line-clamp:6] [display:-webkit-box]">
                      “{rec.quote}”
                    </blockquote>
                    <figcaption className="mt-6 border-t border-zinc-800/80 pt-5">
                      <Author {...rec} />
                    </figcaption>
                  </motion.div>
                </AnimatePresence>
              </motion.figure>
            </Reveal>
          );
        })}
      </div>

      <Reveal>
        <div className="mt-10 flex flex-col items-center gap-2 text-center">
          <p className="font-mono text-[10px] tracking-widest text-zinc-700">
            CLICK A CARD TO READ IT IN FULL
          </p>
          <a
            href={`${profile.links.linkedin}/details/recommendations/`}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs tracking-wider text-zinc-500 underline-offset-4 transition hover:text-emerald-400 hover:underline"
          >
            READ ALL RECOMMENDATIONS ON LINKEDIN ↗
          </a>
        </div>
      </Reveal>
    </section>
  );
}
