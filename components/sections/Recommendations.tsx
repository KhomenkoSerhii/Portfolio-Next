"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
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
        <p className="font-semibold text-zinc-900 dark:text-white">{name}</p>
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

  // embla powers the small-card strip (smooth drag/swipe, no reflow on click)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });
  // tell a real click apart from the end of a drag
  const downX = useRef(0);

  return (
    <section id="recommendations" className="mx-auto max-w-5xl px-6 py-28">
      <SectionTitle index="04 - WHAT PEOPLE SAY">Recommendations</SectionTitle>

      {/* featured quote - crossfades when a card below is clicked */}
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
              <blockquote className="whitespace-pre-line text-lg leading-relaxed text-zinc-700 dark:text-zinc-200 sm:text-xl sm:leading-relaxed">
                {featured.quote}
              </blockquote>
              <figcaption className="mt-6">
                <Author {...featured} />
              </figcaption>
            </motion.div>
          </AnimatePresence>
        </figure>
      </Reveal>

      {/* small clickable cards - drag/swipe strip; click promotes to featured */}
      <div
        className="mt-10 overflow-hidden"
        ref={emblaRef}
        onPointerDownCapture={(e) => {
          downX.current = e.clientX;
        }}
      >
        <div className="flex gap-5 pt-4">
          {recommendations.map((rec, index) => {
            const isActive = index === active;
            return (
              <figure
                key={rec.name}
                role="button"
                tabIndex={0}
                aria-label={`Read ${rec.name}'s recommendation in full`}
                aria-pressed={isActive}
                onClick={(e) => {
                  // ignore the click that ends a drag
                  if (Math.abs(e.clientX - downX.current) > 6) return;
                  setActive(index);
                  emblaApi?.scrollTo(index);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActive(index);
                    emblaApi?.scrollTo(index);
                  }
                }}
                className={`flex min-w-0 flex-[0_0_78%] cursor-pointer flex-col rounded-2xl border bg-white p-6 transition-colors focus-visible:outline-none dark:bg-zinc-950/80 sm:flex-[0_0_46%] lg:flex-[0_0_31%] ${
                  isActive
                    ? "border-emerald-500/60 dark:border-emerald-400/50"
                    : "border-zinc-200 hover:border-emerald-500/40 dark:border-zinc-800/80"
                }`}
              >
                <blockquote className="flex-1 overflow-hidden text-sm leading-relaxed text-zinc-700 dark:text-zinc-200 [-webkit-box-orient:vertical] [-webkit-line-clamp:6] [display:-webkit-box]">
                  “{rec.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-zinc-200 pt-5 dark:border-zinc-800/80">
                  <Author {...rec} />
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>

      <Reveal>
        <div className="mt-10 flex flex-col items-center gap-2 text-center">
          <p className="font-mono text-[10px] tracking-widest text-zinc-400 dark:text-zinc-700">
            SWIPE OR CLICK A CARD TO READ IT IN FULL
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
