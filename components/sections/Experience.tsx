"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { experience } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks/useInViewOnce";
import { Blueprint } from "@/components/motion/Blueprint";
import { DecodeText } from "@/components/motion/DecodeText";
import { DrawnText } from "@/components/motion/DrawnText";

/**
 * A git line that draws down the timeline with the scroll; each role lights up
 * when the line reaches its commit. Returns the drawn length and how many roles it has reached.
 */
function useGitLine() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({
    reach: 100000,
    reached: experience.length,
  });

  useEffect(() => {
    const timeline = ref.current;
    if (!timeline || prefersReducedMotion()) return;
    let frame = 0;
    const update = () => {
      const box = timeline.getBoundingClientRect();
      const reach = Math.min(
        Math.max(window.innerHeight * 0.62 - box.top, 0),
        box.height
      );
      const rows = Array.from(
        timeline.querySelectorAll<HTMLElement>(".git-row")
      );
      setState({
        reach,
        reached: rows.filter((row) => row.offsetTop + 34 <= reach).length,
      });
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return [ref, state] as const;
}

export default function Experience() {
  const [timelineRef, { reach, reached }] = useGitLine();

  return (
    <section id="experience" className="section-shell section-pad">
      <Blueprint className="section-heading">
        <h2 data-bp-box>
          <DrawnText>Seven years across four products.</DrawnText>
        </h2>
        <p
          className="max-w-md text-lg leading-snug text-[var(--muted)]"
          data-bp-box
          style={{ "--i": 1 } as React.CSSProperties}
        >
          <DecodeText
            delay={700}
            text="From eCommerce and internal tools to payment infrastructure and an AI talent platform, on both sides of the API. Open a role for details."
          />
        </p>
      </Blueprint>

      <div
        ref={timelineRef}
        className="git-timeline"
        style={{ "--git-reach": `${reach}px` } as CSSProperties}
      >
        <span aria-hidden="true" className="git-rail" />
        <span aria-hidden="true" className="git-draw" />
        {experience.map((job, index) => (
          <div
            key={job.company}
            className={`git-row ${index < reached ? "is-on" : ""}`}
          >
            <details
              className={`experience-row group ${index > 0 ? "border-t-4 border-[var(--foreground)]" : ""}`}
              open={index === 0}
            >
              <summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_2.75rem] items-start gap-x-4 gap-y-2 py-6 sm:py-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)_auto] lg:items-center lg:gap-8">
                <span className="display col-start-1 row-start-2 text-2xl leading-none sm:text-3xl lg:col-start-auto lg:row-start-auto lg:text-[2.5rem]">
                  {job.period}
                </span>
                <span className="col-start-1 row-start-1 min-w-0 lg:col-start-auto lg:row-start-auto">
                  <code className="git-commit">{job.commit}</code>
                  <span className="block break-words text-2xl font-bold tracking-[-0.02em] sm:text-3xl">
                    {job.company}
                  </span>
                  <span className="mt-1 block break-words text-base text-[var(--muted)]">
                    {job.title}. {job.location}. {job.product}
                  </span>
                </span>
                <span className="col-start-2 row-span-2 row-start-1 flex justify-end lg:col-start-auto lg:row-span-1 lg:row-start-auto">
                  <span className="experience-plus flex h-10 w-10 shrink-0 items-center justify-center border-2 border-[var(--foreground)] text-xl leading-none transition">
                    <svg
                      aria-hidden="true"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="transition-transform group-open:rotate-45"
                    >
                      <path d="M12 4v16M4 12h16" />
                    </svg>
                  </span>
                </span>
              </summary>

              <div className="pb-10 lg:pb-14">
                <ul className="grid gap-x-10 border-t border-[var(--line-strong)] md:grid-cols-2">
                  {job.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="border-b border-[var(--line)] py-4 text-base leading-snug"
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {job.stack.map((item) => (
                    <span
                      key={item}
                      className="bg-[var(--button-solid)] px-2.5 py-1 text-sm font-semibold text-[var(--button-solid-ink)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </details>
          </div>
        ))}
      </div>
    </section>
  );
}
