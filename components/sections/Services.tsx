"use client";

import { motion } from "framer-motion";
import { services } from "@/lib/data";
import { prefillContact } from "@/lib/contact-prefill";
import { Reveal, SectionTitle } from "@/components/ui/Reveal";

type IconKey = "rescue" | "ai" | "performance" | "web3";

function ServiceIcon({ icon }: { icon: IconKey }) {
  const common = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (icon) {
    case "rescue":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3.5" />
          <path d="M4.5 4.5l5 5M14.5 14.5l5 5M19.5 4.5l-5 5M9.5 14.5l-5 5" />
        </svg>
      );
    case "ai":
      return (
        <svg {...common}>
          <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
          <path d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" />
        </svg>
      );
    case "performance":
      return (
        <svg {...common}>
          <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
          <path d="M12 12l4-4" />
          <path d="M4 18a9 9 0 1 1 16 0" />
        </svg>
      );
    case "web3":
      return (
        <svg {...common}>
          <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" />
          <path d="M12 2v18M4 6.5l8 4.5 8-4.5" />
        </svg>
      );
  }
}

const accents = {
  ai: {
    text: "text-[var(--accent-strong)]",
    border: "border-[var(--line)] hover:border-[var(--accent)]",
    dot: "bg-[var(--accent)]",
    glow: "bg-[var(--accent-soft)]",
    icon: "text-[var(--accent-strong)]",
    link: "text-[var(--accent-strong)] hover:text-[var(--accent)]",
  },
  default: {
    text: "text-[var(--accent-strong)]",
    border: "border-[var(--line)] hover:border-[var(--accent)]",
    dot: "bg-[var(--accent)]",
    glow: "bg-[var(--accent-soft)]",
    icon: "text-[var(--accent-strong)]",
    link: "text-[var(--accent-strong)] hover:text-[var(--accent)]",
  },
} as const;

function Bullets({
  bullets,
  dot,
}: {
  bullets: readonly string[];
  dot: string;
}) {
  return (
    <ul className="space-y-2.5">
      {bullets.map((b) => (
        <li
          key={b}
          className="flex gap-3 text-sm leading-relaxed text-[var(--foreground)]"
        >
          <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${dot}`} />
          {b}
        </li>
      ))}
    </ul>
  );
}

export default function Services() {
  const [hero, ...rest] = services.featured;
  const heroAccent = accents[hero.accent];

  return (
    <section id="services" className="mx-auto max-w-5xl px-6 py-28">
      <SectionTitle index="05 - SERVICES">What I can do for you</SectionTitle>
      <p className="-mt-8 mb-12 max-w-2xl text-sm text-[var(--muted)]">
        {services.intro}
      </p>

      {/* flagship - wide hero card */}
      <Reveal>
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className={`relative overflow-hidden rounded-3xl border bg-[var(--surface)] p-7 backdrop-blur-md transition-colors sm:p-9 ${heroAccent.border}`}
        >
          <div
            aria-hidden
            className={`pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl ${heroAccent.glow}`}
          />
          <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <div className="flex items-center gap-3">
                <span className={heroAccent.icon}>
                  <ServiceIcon icon={hero.icon} />
                </span>
                <p className={`font-mono text-[10px] tracking-widest ${heroAccent.text}`}>
                  {hero.tag}
                </p>
              </div>
              <h3 className="mt-4 font-display text-3xl font-bold uppercase tracking-tight text-[var(--foreground)] sm:text-4xl">
                {hero.title}
              </h3>
              <p className="mt-3 text-base italic text-[var(--muted)]">
                {hero.tagline}
              </p>
              <a
                href="#contact"
                onClick={() => prefillContact(hero.title)}
                className={`mt-6 inline-block font-mono text-xs tracking-wider underline-offset-4 transition hover:underline ${heroAccent.link}`}
              >
                DISCUSS THIS →
              </a>
            </div>
            <Bullets bullets={hero.bullets} dot={heroAccent.dot} />
          </div>
        </motion.div>
      </Reveal>

      {/* the rest - equal row of three */}
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {rest.map((s, i) => {
          const a = accents[s.accent];
          return (
            <Reveal key={s.title} delay={i * 0.06}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className={`flex h-full flex-col rounded-2xl border bg-[var(--surface)] p-7 backdrop-blur-md transition-colors ${a.border}`}
              >
                <div className="flex items-start justify-between">
                  <span className={a.icon}>
                    <ServiceIcon icon={s.icon} />
                  </span>
                  {s.metric && (
                    <span className={`font-mono text-[10px] font-bold tracking-wider ${a.text}`}>
                      {s.metric}
                    </span>
                  )}
                </div>
                <p className={`mt-4 font-mono text-[10px] tracking-widest ${a.text}`}>
                  {s.tag}
                </p>
                <h3 className="mt-2 font-display text-xl font-bold uppercase tracking-tight text-[var(--foreground)]">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm italic text-[var(--muted)]">
                  {s.tagline}
                </p>
                <div className="mt-5 flex-1">
                  <Bullets bullets={s.bullets} dot={a.dot} />
                </div>
                <a
                  href="#contact"
                  onClick={() => prefillContact(s.title)}
                  className={`mt-6 inline-block font-mono text-xs tracking-wider underline-offset-4 transition hover:underline ${a.link}`}
                >
                  DISCUSS THIS →
                </a>
              </motion.div>
            </Reveal>
          );
        })}
      </div>

      {/* everything else - compact pill cloud (blurb on hover) */}
      <Reveal>
        <p className="mb-4 mt-14 font-mono text-[10px] tracking-widest text-[var(--muted)]">
          ALSO AVAILABLE
        </p>
        <div className="flex flex-wrap gap-2.5">
          {services.secondary.map((s) => (
            <span
              key={s.title}
              title={s.blurb}
              className="group inline-flex cursor-default items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-1.5 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)]"
            >
              <span className="h-1 w-1 shrink-0 rounded-full bg-[var(--accent)] transition group-hover:scale-150" />
              {s.title}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
