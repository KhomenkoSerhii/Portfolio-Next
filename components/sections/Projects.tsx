"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { caseStudies, type CaseStudy } from "@/lib/data";
import { Reveal } from "@/components/ui/Reveal";

const accentStyles = {
  lime: {
    line: "bg-[var(--accent)]",
    text: "text-[var(--accent-strong)]",
    wash: "from-lime-300/20 via-lime-300/5",
  },
  cyan: {
    line: "bg-cyan-400",
    text: "text-cyan-500 dark:text-cyan-300",
    wash: "from-cyan-400/20 via-cyan-400/5",
  },
  orange: {
    line: "bg-orange-500",
    text: "text-orange-600 dark:text-orange-400",
    wash: "from-orange-400/20 via-orange-400/5",
  },
} as const;

function DiagramFrame({
  study,
  title,
  children,
}: {
  study: CaseStudy;
  title: string;
  children: ReactNode;
}) {
  const accent = accentStyles[study.accent];

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className="system-visual relative aspect-[3/4] overflow-hidden border border-[var(--line-strong)] bg-[var(--surface)] sm:aspect-[4/3] [transform-style:preserve-3d]"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${accent.wash} to-transparent`} />
      <div className="absolute inset-x-0 top-0 flex h-10 items-center justify-between border-b border-[var(--line)] px-4">
        <div className="flex gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--line-strong)]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--line-strong)]" />
          <span className={`h-1.5 w-1.5 rounded-full ${accent.line}`} />
        </div>
        <span className="font-mono text-[8px] tracking-[0.2em] text-[var(--muted)]">
          {title} / {study.index}
        </span>
      </div>

      <div className="absolute inset-x-5 bottom-5 top-14 sm:inset-x-7 sm:bottom-7 sm:top-16">
        {children}
      </div>
    </motion.div>
  );
}

function AiMatchingDiagram({ study }: { study: CaseStudy }) {
  const steps = ["PROFILE", "AI PARSE", "MATCH", "RANK"];

  return (
    <DiagramFrame study={study} title="AI MATCHING PIPELINE">
      <div className="flex h-full flex-col gap-3 sm:gap-4">
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-2">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`relative border p-2 font-mono text-[7px] tracking-[0.1em] sm:p-3 sm:text-[8px] ${
                index === steps.length - 1
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-strong)]"
                  : "border-[var(--line)] text-[var(--muted)]"
              }`}
            >
              <span className="mb-2 block text-[6px] opacity-60">0{index + 1}</span>
              {step}
            </div>
          ))}
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-[0.8fr_1.2fr]">
          <div className="border border-[var(--line)] bg-[var(--background)]/50 p-3 sm:p-4">
            <p className="font-mono text-[7px] tracking-[0.16em] text-[var(--muted)]">CANDIDATE PROFILE</p>
            <div className="mt-3 flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--line)] font-mono text-[8px]">SK</span>
              <div className="min-w-0">
                <span className="block text-[10px] font-semibold sm:text-xs">Senior Frontend Engineer</span>
                <span className="font-mono text-[7px] text-[var(--muted)]">REMOTE · 6+ YEARS</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1">
              {["REACT", "TS", "AI UX"].map((skill) => (
                <span key={skill} className="border border-[var(--line)] px-1.5 py-1 font-mono text-[6px] text-[var(--muted)]">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="border border-[var(--line)] bg-[var(--background)]/50 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[7px] tracking-[0.16em] text-[var(--muted)]">RANKED MATCHES</p>
              <span className="flex items-center gap-1 font-mono text-[6px] text-[var(--accent-strong)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> LIVE
              </span>
            </div>
            <div className="mt-3 space-y-2">
              {[
                ["Frontend Lead", "94%"],
                ["Product Engineer", "89%"],
                ["UI Platform", "83%"],
              ].map(([role, score], index) => (
                <div key={role} className="flex items-center justify-between border-b border-[var(--line)] pb-2">
                  <span className="font-mono text-[7px] sm:text-[8px]">0{index + 1} / {role}</span>
                  <span className={index === 0 ? "text-[var(--accent-strong)]" : "text-[var(--muted)]"}>{score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DiagramFrame>
  );
}

function SearchDiagram({ study }: { study: CaseStudy }) {
  return (
    <DiagramFrame study={study} title="FACETED SEARCH">
      <div className="flex h-full flex-col gap-3">
        <div className="flex min-w-0 items-center border border-cyan-400/60 bg-[var(--background)]/60 px-3 py-2.5">
          <span className="mr-2 text-cyan-500">⌕</span>
          <span className="min-w-0 truncate font-mono text-[8px] text-[var(--muted)]">cyber insurance · united kingdom</span>
          <span className="ml-auto shrink-0 pl-2 font-mono text-[7px] text-cyan-500">248 RESULTS</span>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-[0.68fr_1.32fr]">
          <div className="border border-[var(--line)] p-3 sm:p-4">
            <p className="font-mono text-[7px] tracking-[0.16em] text-[var(--muted)]">FILTERS</p>
            <div className="mt-3 space-y-2.5">
              {[["MARKET", "UK"], ["TYPE", "CYBER"], ["STATUS", "ACTIVE"]].map(([label, value]) => (
                <div key={label} className="border-b border-[var(--line)] pb-2">
                  <span className="block font-mono text-[6px] text-[var(--muted)]">{label}</span>
                  <span className="mt-1 block font-mono text-[8px] text-cyan-500">+ {value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {[
              ["01", "Global Cyber Cover", "VERIFIED"],
              ["02", "SME Risk Package", "MATCH"],
              ["03", "Technology E&O", "MATCH"],
            ].map(([number, name, status], index) => (
              <div key={name} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border border-[var(--line)] bg-[var(--background)]/45 p-3">
                <span className="font-mono text-[7px] text-[var(--muted)]">{number}</span>
                <span className="min-w-0 truncate text-[9px] font-medium sm:text-[11px]">{name}</span>
                <span className={`font-mono text-[6px] ${index === 0 ? "text-cyan-500" : "text-[var(--muted)]"}`}>{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DiagramFrame>
  );
}

function PaymentDiagram({ study }: { study: CaseStudy }) {
  const route = ["WALLET", "PROVIDER", "CHAIN", "CONFIRMED"];

  return (
    <DiagramFrame study={study} title="PAYMENT ROUTE">
      <div className="flex h-full flex-col gap-3 sm:gap-4">
        <div className="flex items-end justify-between border-b border-[var(--line)] pb-3">
          <div>
            <p className="font-mono text-[7px] tracking-[0.16em] text-[var(--muted)]">TRANSACTION</p>
            <p className="mt-1 font-display text-2xl font-extrabold tracking-[-0.05em] sm:text-3xl">2,480.00 USDC</p>
          </div>
          <span className="border border-orange-400/60 bg-orange-400/10 px-2 py-1 font-mono text-[7px] text-orange-500">CONFIRMED</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-2">
          {route.map((step, index) => (
            <div key={step} className="relative border border-[var(--line)] p-2 sm:p-3">
              <span className={`block h-1 w-full ${index === route.length - 1 ? "bg-orange-400" : "bg-[var(--line-strong)]"}`} />
              <span className="mt-3 block font-mono text-[6px] text-[var(--muted)] sm:text-[7px]">{step}</span>
              <span className="mt-1 block font-mono text-[6px] text-orange-500">✓ OK</span>
            </div>
          ))}
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-3 border border-[var(--line)] bg-[var(--background)]/45">
          {[["NETWORK", "ETHEREUM"], ["BLOCK", "21,043,812"], ["FINALITY", "12 / 12"]].map(([label, value], index) => (
            <div key={label} className={`p-3 sm:p-4 ${index ? "border-l border-[var(--line)]" : ""}`}>
              <span className="block font-mono text-[6px] tracking-[0.12em] text-[var(--muted)]">{label}</span>
              <span className="mt-2 block font-mono text-[7px] sm:text-[8px]">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </DiagramFrame>
  );
}

function ProductDiagram({ study }: { study: CaseStudy }) {
  if (study.index === "01") return <AiMatchingDiagram study={study} />;
  if (study.index === "02") return <SearchDiagram study={study} />;
  return <PaymentDiagram study={study} />;
}

export default function Projects() {
  return (
    <section id="work" className="section-shell section-pad content-auto">
      <Reveal>
        <div className="section-heading">
          <div>
            <p className="section-index">01 / SELECTED SYSTEMS</p>
            <h2>Built where the edge cases live.</h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-[var(--muted)] md:pt-3">
            Not gallery pieces. Production systems shaped by latency, changing
            requirements, real users, and measurable outcomes.
          </p>
        </div>
      </Reveal>

      <div className="mt-14 border-t border-[var(--line)]">
        {caseStudies.map((study, index) => {
          const accent = accentStyles[study.accent];
          const reverse = index % 2 === 1;

          return (
            <Reveal key={study.name} className="border-b border-[var(--line)] py-12 sm:py-16 lg:py-20">
              <article className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
                <div className={`min-w-0 lg:col-span-7 ${reverse ? "lg:order-2" : ""}`}>
                  <ProductDiagram study={study} />
                </div>

                <div className={`project-copy lg:col-span-5 ${reverse ? "lg:order-1" : ""}`}>
                  <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
                    <p className={`font-mono text-[10px] tracking-[0.2em] ${accent.text}`}>
                      {study.eyebrow}
                    </p>
                    <span className="font-mono text-xs text-[var(--muted)]">/{study.index}</span>
                  </div>
                  <h3 className="project-title mt-7 font-display font-extrabold uppercase leading-[1.12] tracking-[-0.04em]">
                    {study.name}
                  </h3>
                  <p className="mt-6 text-base leading-[1.75] text-[var(--muted)]">
                    {study.description}
                  </p>

                  <div className="mt-8 grid grid-cols-2 border-y border-[var(--line)]">
                    <div className="py-5 pr-4">
                      <p className={`font-display text-3xl font-extrabold tracking-[-0.05em] ${accent.text}`}>
                        {study.outcome}
                      </p>
                      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--muted)]">
                        {study.outcomeLabel}
                      </p>
                    </div>
                    <div className="border-l border-[var(--line)] py-5 pl-5">
                      <p className="font-display text-3xl font-extrabold tracking-[-0.05em]">
                        {study.secondaryMetric}
                      </p>
                      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--muted)]">
                        {study.secondaryLabel}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
                    {study.stack.map((item) => (
                      <span key={item} className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
                        + {item}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
