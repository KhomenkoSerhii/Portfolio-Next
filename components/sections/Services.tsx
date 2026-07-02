"use client";

import { motion } from "framer-motion";
import { services } from "@/lib/data";
import { Reveal, SectionTitle } from "@/components/ui/Reveal";

export default function Services() {
  return (
    <section id="services" className="mx-auto max-w-5xl px-6 py-28">
      <SectionTitle index="04 – SERVICES">What I can do for you</SectionTitle>
      <p className="-mt-8 mb-12 max-w-2xl text-sm text-zinc-400">
        {services.intro}
      </p>

      {/* flagship services */}
      <div className="grid gap-6 md:grid-cols-2">
        {services.featured.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.06}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className={`flex h-full flex-col rounded-2xl border bg-zinc-950/80 p-7 backdrop-blur-md transition-colors ${
                s.accent === "ai"
                  ? "border-cyan-500/25 hover:border-cyan-400/50"
                  : "border-zinc-800/80 hover:border-emerald-500/40"
              }`}
            >
              <p
                className={`font-mono text-[10px] tracking-widest ${
                  s.accent === "ai" ? "text-cyan-400" : "text-emerald-400"
                }`}
              >
                {s.tag}
              </p>
              <h3 className="mt-3 font-display text-2xl font-bold uppercase tracking-tight text-white">
                {s.title}
              </h3>
              <p className="mt-2 text-sm italic text-zinc-400">{s.tagline}</p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {s.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex gap-3 text-sm leading-relaxed text-zinc-200"
                  >
                    <span
                      className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${
                        s.accent === "ai" ? "bg-cyan-400" : "bg-emerald-400"
                      }`}
                    />
                    {b}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`mt-6 inline-block font-mono text-xs tracking-wider underline-offset-4 transition hover:underline ${
                  s.accent === "ai"
                    ? "text-cyan-300 hover:text-cyan-200"
                    : "text-emerald-400 hover:text-emerald-300"
                }`}
              >
                DISCUSS THIS →
              </a>
            </motion.div>
          </Reveal>
        ))}
      </div>

      {/* everything else, compact */}
      <Reveal>
        <div className="mt-10 rounded-2xl border border-zinc-800/60 px-6 py-5">
          <p className="mb-4 font-mono text-[10px] tracking-widest text-zinc-500">
            ALSO AVAILABLE
          </p>
          <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.secondary.map((s) => (
              <p key={s.title} className="text-sm leading-relaxed">
                <span className="font-semibold text-zinc-200">{s.title}</span>
                <span className="text-zinc-500"> – {s.blurb}</span>
              </p>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
