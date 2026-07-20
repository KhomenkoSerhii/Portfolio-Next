"use client";

import { motion } from "framer-motion";
import { experience } from "@/lib/data";
import { Reveal, SectionTitle } from "@/components/ui/Reveal";

export default function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-5xl px-6 py-28">
      <SectionTitle index="01 - CAREER">Experience</SectionTitle>
      <div className="relative ml-3 border-l border-zinc-200 dark:border-zinc-800">
        {experience.map((job, i) => (
          <Reveal key={job.company} delay={i * 0.08} className="relative pb-14 pl-10 last:pb-0">
            {/* timeline dot */}
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 300, damping: 18, delay: i * 0.08 }}
              className="absolute -left-[7px] top-1.5 block h-3.5 w-3.5 rounded-full bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.8)]"
            />
            <div className="group rounded-2xl border border-zinc-200 bg-white p-6 backdrop-blur transition hover:border-emerald-500/40 hover:bg-zinc-50 dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/70">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  {job.company}
                  <span className="ml-2 text-sm font-normal text-zinc-500">
                    {job.location}
                  </span>
                </h3>
                <span className="font-mono text-sm text-emerald-600 dark:text-emerald-400">{job.period}</span>
              </div>
              <p className="mt-1 text-zinc-600 dark:text-zinc-300">
                {job.title} · {job.product}
              </p>
              <ul className="mt-4 space-y-2">
                {job.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                    {h}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                {job.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 font-mono text-xs text-zinc-500 transition group-hover:border-emerald-500/30 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
