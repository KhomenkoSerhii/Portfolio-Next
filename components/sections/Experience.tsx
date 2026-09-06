"use client";

import { experience } from "@/lib/data";
import { Reveal } from "@/components/ui/Reveal";

export default function Experience() {
  return (
    <section id="experience" className="section-shell section-pad content-auto">
      <Reveal>
        <div className="section-heading">
          <div>
            <p className="section-index">03 / EXPERIENCE LOG</p>
            <h2>Seven years. Four product chapters.</h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-[var(--muted)] md:pt-3">
            From commerce and internal tools to financial infrastructure and
            AI-native talent products. Open a chapter for the full build log.
          </p>
        </div>
      </Reveal>

      <div className="mt-14 border-t border-[var(--line-strong)]">
        {experience.map((job, index) => (
          <Reveal key={job.company} delay={index * 0.04}>
            <details className="experience-row group border-b border-[var(--line-strong)]" open={index === 0}>
              <summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_2.75rem] items-start gap-x-4 gap-y-3 py-7 sm:grid-cols-[7.5rem_minmax(0,1fr)_auto] sm:items-center sm:gap-5 sm:py-9">
                <span className="col-start-1 row-start-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] sm:col-start-auto sm:row-start-auto">
                  {job.period}
                </span>
                <span className="col-start-1 row-start-2 min-w-0 sm:col-start-auto sm:row-start-auto">
                  <span className="block break-words font-display text-3xl font-extrabold uppercase tracking-[-0.045em] sm:text-4xl">
                    {job.company}
                  </span>
                  <span className="mt-1 block break-words text-sm text-[var(--muted)]">
                    {job.title} · {job.product}
                  </span>
                  <span className="mt-2 block font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--muted)] sm:hidden">
                    {job.location}
                  </span>
                </span>
                <span className="col-start-2 row-span-2 row-start-1 flex justify-end self-start sm:col-start-auto sm:row-span-1 sm:row-start-auto sm:items-center sm:gap-5 sm:self-auto">
                  <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] sm:inline">
                    {job.location}
                  </span>
                  <span className="experience-plus flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--line-strong)] text-xl leading-none transition">
                    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-open:rotate-45">
                      <path d="M12 4v16M4 12h16" />
                    </svg>
                  </span>
                </span>
              </summary>

              <div className="grid gap-8 pb-10 sm:pl-[9.5rem] lg:grid-cols-[1fr_16rem] lg:gap-16 lg:pb-14">
                <ul className="space-y-3">
                  {job.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-4 text-sm leading-[1.7] text-[var(--muted)] sm:text-[15px]">
                      <span className="mt-[0.7em] h-px w-4 shrink-0 bg-[var(--accent)]" />
                      {highlight}
                    </li>
                  ))}
                </ul>
                <div className="border-l border-[var(--line)] pl-5">
                  <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--accent-strong)]">
                    Working stack
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-2">
                    {job.stack.map((item) => (
                      <span key={item} className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
