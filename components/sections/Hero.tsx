"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/data";
import StackLayers from "@/components/visuals/StackLayers";

const reveal = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const metrics = [
  { value: "7+", label: "years shipping" },
  { value: "100K+", label: "users served" },
  { value: "~35%", label: "faster apps" },
  { value: "UI+API", label: "full-stack delivery" },
];

export default function Hero() {
  return (
    <section id="about" className="relative min-h-svh overflow-hidden border-b border-[var(--line)] pt-24">
      <div className="pointer-events-none absolute inset-y-0 left-[7.5%] hidden w-px bg-[var(--line)] xl:block" />
      <div className="pointer-events-none absolute inset-y-0 right-[7.5%] hidden w-px bg-[var(--line)] xl:block" />
      <div className="hero-scanline" aria-hidden />

      <div className="pointer-events-none absolute bottom-28 right-0 top-24 hidden w-[46%] lg:block">
        <StackLayers />
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.1, delayChildren: 0.08 }}
        className="section-shell relative z-10 flex min-h-[calc(100svh-6rem)] flex-col"
      >
        <div className="grid min-w-0 flex-1 items-center gap-10 py-14 lg:py-20">
          <div className="min-w-0 max-w-4xl">
            <motion.p variants={reveal} className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] sm:text-xs">
              <span className="inline-flex items-center gap-2.5 text-[var(--foreground)]">
                <span className="pulse-dot h-2 w-2 rounded-full bg-[var(--accent)]" aria-hidden />
                {profile.name}
              </span>
              <span>{profile.location} · Remote EMEA</span>
            </motion.p>

            <motion.h1 variants={reveal} className="hero-title max-w-[11ch] font-display font-extrabold uppercase">
              Senior
              <span className="block text-[var(--accent-strong)]">Software</span>
              Engineer.
            </motion.h1>

            <motion.p variants={reveal} className="mt-7 max-w-2xl font-mono text-[10px] uppercase leading-[1.9] tracking-[0.16em] text-[var(--foreground)] sm:text-xs">
              Product-minded full-stack, frontend-heavy
              <span className="block text-[var(--muted)]">
                React · Next.js · Node.js · TypeScript · AI/LLM
              </span>
            </motion.p>

            <motion.p variants={reveal} className="mt-6 max-w-lg text-base leading-[1.7] text-[var(--muted)] sm:text-lg">
              I build whole features, from the React interface to the Node.js
              API behind it.
            </motion.p>

            <motion.div variants={reveal} className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#work" className="button-primary">
                View work
                <span aria-hidden>↘</span>
              </a>
              <a href={profile.cvUrl} download className="button-secondary">
                Download CV ↓
              </a>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="button-secondary"
              >
                LinkedIn ↗
              </a>
            </motion.div>
          </div>

        </div>

        <motion.div variants={reveal} className="grid grid-cols-2 border-t border-[var(--line)] lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className={`py-5 sm:py-7 ${index % 2 ? "border-l" : ""} ${index > 1 ? "border-t lg:border-t-0" : ""} ${index > 0 ? "lg:border-l" : ""} border-[var(--line)] px-4 first:pl-0 lg:px-7`}
            >
              <p className="font-display text-3xl font-extrabold tracking-[-0.05em] sm:text-4xl">
                {metric.value}
              </p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--muted)]">
                {metric.label}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
