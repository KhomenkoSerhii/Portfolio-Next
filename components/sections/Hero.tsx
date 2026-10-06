"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/data";
import SignalFlow from "@/components/visuals/SignalFlow";

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

      <div className="pointer-events-none absolute inset-x-0 bottom-20 h-[42%] opacity-45 sm:h-[48%] lg:bottom-8 lg:left-[48%] lg:top-24 lg:h-auto lg:opacity-100">
        <SignalFlow />
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.1, delayChildren: 0.08 }}
        className="section-shell relative z-10 flex min-h-[calc(100svh-6rem)] flex-col"
      >
        <div className="grid min-w-0 flex-1 items-center gap-10 py-14 lg:grid-cols-[1.08fr_0.92fr] lg:py-20">
          <div className="min-w-0 max-w-4xl">
            <motion.div variants={reveal} className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
              <span className="inline-flex items-center gap-2 text-[var(--accent-strong)]">
                <span className="pulse-dot h-2 w-2 rounded-full bg-[var(--accent)]" />
                Available for the right team
              </span>
              <span>{profile.location}</span>
              <span>Remote · EMEA</span>
            </motion.div>

            <motion.p variants={reveal} className="mb-4 max-w-full font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)] sm:text-xs sm:tracking-[0.22em]">
              {profile.name}
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

            <motion.p variants={reveal} className="mt-6 max-w-xl text-base leading-[1.75] text-[var(--muted)] sm:text-lg">
              I build products end to end: React interfaces, the Node.js APIs
              behind them, payments, real-time flows, and AI features that hold
              up in production.
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

          <motion.div variants={reveal} className="hidden self-end justify-self-end pb-10 lg:block">
            <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--muted)] [writing-mode:vertical-rl]">
              <span>Complex interface states mapped as live signals</span>
              <span className="h-16 w-px bg-[var(--accent)]" />
              <span>SVG / CSS / 2026</span>
            </div>
          </motion.div>
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
