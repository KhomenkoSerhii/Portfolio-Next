"use client";

import { motion } from "framer-motion";
import { projects } from "@/lib/data";
import { Reveal, SectionTitle } from "@/components/ui/Reveal";

export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-28">
      <SectionTitle index="03 - SELECTED WORK">Side Projects</SectionTitle>
      <p className="-mt-8 mb-12 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
        Things I built end to end, outside of client work - to try an idea,
        learn a platform, or scratch my own itch.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {projects.map((p, i) => {
          const isAi = p.accent === "ai";
          return (
            <Reveal key={p.name} delay={i * 0.06}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className={`flex h-full flex-col rounded-2xl border bg-white p-6 backdrop-blur-md transition-colors dark:bg-zinc-950/80 ${
                  isAi
                    ? "border-cyan-500/25 hover:border-cyan-400/50"
                    : "border-zinc-200 hover:border-emerald-500/40 dark:border-zinc-800/80"
                }`}
              >
                <p
                  className={`font-mono text-[10px] tracking-widest ${
                    isAi
                      ? "text-cyan-500 dark:text-cyan-400"
                      : "text-emerald-500 dark:text-emerald-400"
                  }`}
                >
                  {p.tag}
                </p>
                <h3 className="mt-2 font-display text-xl font-bold uppercase tracking-tight text-zinc-900 dark:text-white">
                  {p.name}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
                  {p.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-zinc-200 bg-zinc-100 px-2.5 py-0.5 font-mono text-[10px] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
