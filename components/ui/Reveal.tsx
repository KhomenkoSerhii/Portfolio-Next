"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionTitle({
  index,
  children,
}: {
  index?: string;
  children: ReactNode;
}) {
  return (
    <Reveal>
      <div className="mb-14 border-b border-[var(--line)] pb-8 sm:mb-16">
        {index && (
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--accent-strong)]">
            {index}
          </p>
        )}
        <h2 className="max-w-4xl font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
          {children}
        </h2>
      </div>
    </Reveal>
  );
}
