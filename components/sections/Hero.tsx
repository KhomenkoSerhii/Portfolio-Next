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
  { value: "35%", label: "faster apps" },
  { value: "UI+API", label: "full-stack delivery", small: true },
];

export default function Hero() {
  return (
    <section id="about" className="relative overflow-hidden pt-16">
      <div className="hero-scanline" aria-hidden />

      <motion.div
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.1, delayChildren: 0.08 }}
        className="section-shell relative flex min-h-[calc(100svh-4rem)] flex-col"
      >
        <div className="relative z-10 pt-10 lg:pt-8">
          <motion.p variants={reveal} className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base font-medium">
            <span className="inline-flex items-center gap-2.5 font-bold">
              <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-[var(--accent)]" aria-hidden />
              {profile.name}
            </span>
            <span className="text-[var(--muted)]">{profile.location}, remote EMEA</span>
          </motion.p>

          <motion.h1 variants={reveal} className="hero-title display mt-4 lg:mt-3">
            Senior Software Engineer
          </motion.h1>
        </div>

        <div className="grid flex-1 items-start gap-8 py-8 lg:grid-cols-2 lg:gap-12 lg:py-6">
          <div className="relative z-10 min-w-0">
            <motion.p variants={reveal} className="text-lg font-bold sm:text-xl">
              Product-minded full-stack, frontend-heavy
            </motion.p>
            <motion.p variants={reveal} className="mt-1 text-base text-[var(--muted)]">
              React, Next.js, Node.js, TypeScript, AI/LLM
            </motion.p>
            <motion.p variants={reveal} className="mt-5 max-w-lg text-lg leading-snug sm:text-xl">
              I build whole features, from the React interface to the Node.js
              API behind it.
            </motion.p>

            <motion.div variants={reveal} className="mt-7 flex flex-wrap items-center gap-3">
              <a href="#portfolio" className="button-primary">
                View work
              </a>
              <a href={profile.cvUrl} download className="button-secondary">
                Download CV
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

          <div className="pointer-events-none relative hidden h-full min-h-[17rem] lg:block">
            <StackLayers />
          </div>
        </div>

        <motion.div variants={reveal} className="-mx-4 grid grid-cols-2 sm:mx-0 lg:grid-cols-[1fr_1.45fr_1fr_1.25fr]">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className={`min-w-0 border-t-4 px-4 pb-6 pt-5 lg:px-5 ${
                index === 0
                  ? "border-[var(--accent)] bg-[var(--accent)] text-[#0e0e0e]"
                  : "border-[var(--foreground)]"
              }`}
            >
              <p className={`metric-value display ${metric.small ? "metric-value-small" : ""}`}>
                {metric.value}
              </p>
              <p className="mt-2 text-base font-semibold">{metric.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
