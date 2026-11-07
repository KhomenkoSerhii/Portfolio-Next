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
            text="The short version: what I shipped and how. The full list is in the CV."
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
          <article
            key={job.company}
            className={`git-row grid gap-x-10 gap-y-3 py-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:py-10 ${
              index > 0 ? "border-t-4 border-[var(--foreground)]" : ""
            } ${index < reached ? "is-on" : ""}`}
          >
            <div>
              <p className="display text-2xl leading-none sm:text-3xl lg:text-[2.5rem]">{job.period}</p>
              <p className="mt-2 text-base text-[var(--muted)]">
                {job.title}, {job.location}
              </p>
            </div>
            <div className="min-w-0">
              <code className="git-commit">{job.commit}</code>
              <h3 className="text-2xl font-bold tracking-[-0.02em] sm:text-3xl">{job.company}</h3>
              <p className="mt-2 max-w-2xl text-lg leading-snug">{job.summary}</p>
              {job.practice ? (
                <ul className="practice-list mt-5 grid gap-x-8 sm:grid-cols-2">
                  {job.practice.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-1.5">
                {job.stack.slice(0, 8).map((item) => (
                  <span
                    key={item}
                    className="bg-[var(--button-solid)] px-2.5 py-1 text-sm font-semibold text-[var(--button-solid-ink)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
