"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { WorkScreen } from "@/lib/data";

const ADVANCE_MS = 3800;

// where a card sits for its depth in the stack (0 = front);
// spread fans the deck out while the pointer is over it
function placement(depth: number, spread: boolean) {
  return spread
    ? { x: `${depth * 6}%`, y: `${-depth * 5}%`, rotate: depth * 1.4, scale: 1 - depth * 0.035 }
    : { x: `${depth * 4.5}%`, y: `${-depth * 6.5}%`, rotate: 0, scale: 1 - depth * 0.05 };
}

export function ScreenDeck({
  name,
  host,
  screens,
  onOpen,
  suspended = false,
}: {
  name: string;
  host: string;
  screens: WorkScreen[];
  onOpen: (index: number) => void;
  suspended?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: "-15% 0px" });
  const reducedMotion = useReducedMotion();
  const autoplay = inView && !paused && !suspended && !reducedMotion;

  // flip to the next screen on a timer while the deck is on screen and idle
  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setTimeout(() => setActive((i) => (i + 1) % screens.length), ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [autoplay, active, screens.length]);

  return (
    <div
      ref={rootRef}
      className="grid gap-8"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative aspect-[16/11.5] [perspective:1600px]">
        {/* tilt follows the wrapper's hover state, not :hover on this moving element,
            so the deck never slides out from under the cursor. No preserve-3d here:
            inside a 3D context hit-testing ignores z-index and back cards steal clicks */}
        <div
          className={`absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${
            paused ? "[transform:rotateX(2deg)_rotateY(-4deg)]" : "[transform:rotateX(6deg)_rotateY(-12deg)]"
          }`}
        >
          {screens.map((screen, index) => {
            const depth = (index - active + screens.length) % screens.length;
            const front = depth === 0;
            return (
              <motion.div
                key={screen.src}
                initial={false}
                animate={placement(depth, paused)}
                transition={{ duration: reducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{ zIndex: screens.length - depth }}
                className={`absolute bottom-0 left-0 w-[78%] origin-bottom-left overflow-hidden border bg-[var(--surface)] shadow-[0_30px_60px_-30px_rgba(0,0,0,.55)] transition-colors ${
                  front ? "border-[var(--line-strong)]" : "border-[var(--line-strong)] hover:border-[var(--accent)]"
                }`}
              >
                <div className="flex h-6 items-center gap-2 border-b border-[var(--line)] px-2.5">
                  <span className="flex gap-1" aria-hidden>
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--line-strong)]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--line-strong)]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                  </span>
                  <span className="min-w-0 truncate font-mono text-[8px] tracking-[0.12em] text-[var(--muted)]">
                    {host}
                    {screen.path}
                  </span>
                </div>
                <div className="relative aspect-[16/10]">
                  <Image
                    src={screen.src}
                    alt={`${name}: ${screen.title} screen`}
                    fill
                    sizes="(min-width: 1024px) 560px, 80vw"
                    className="object-cover object-top"
                  />
                  {/* back cards sit in shadow so the front one reads first */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[var(--background)] transition-opacity duration-700"
                    style={{ opacity: Math.min(depth * 0.14, 0.6) }}
                  />
                  {front ? (
                    <button
                      type="button"
                      onClick={() => onOpen(index)}
                      aria-label={`Open ${name} product tour at ${screen.title}`}
                      className="absolute bottom-3 right-3 bg-[var(--accent)] px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#11150d] outline-offset-2 transition-transform hover:-translate-y-0.5"
                    >
                      Open tour ↗
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      aria-label={`Show ${screen.title}`}
                      className="absolute inset-0 cursor-pointer"
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <ol className="grid gap-px border-y border-[var(--line)] sm:grid-cols-5">
        {screens.map((screen, index) => {
          const current = index === active;
          return (
            <li key={screen.src}>
              <button
                type="button"
                onClick={() => setActive(index)}
                onPointerEnter={() => setActive(index)}
                aria-current={current ? "true" : undefined}
                className="group relative flex w-full items-baseline gap-2 py-3 text-left font-mono text-[10px] uppercase tracking-[0.14em] sm:block"
              >
                <span className={current ? "text-[var(--accent-strong)]" : "text-[var(--muted)]"}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={`block transition-colors sm:mt-1.5 ${
                    current ? "text-[var(--foreground)]" : "text-[var(--muted)] group-hover:text-[var(--foreground)]"
                  }`}
                >
                  {screen.title}
                </span>
                {/* progress toward the next automatic flip */}
                <span aria-hidden className="absolute inset-x-0 top-0 h-px overflow-hidden">
                  {current ? (
                    <motion.span
                      key={`${active}-${autoplay}`}
                      className="block h-full origin-left bg-[var(--accent)]"
                      initial={{ scaleX: autoplay ? 0 : 1 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: autoplay ? ADVANCE_MS / 1000 : 0, ease: "linear" }}
                    />
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
