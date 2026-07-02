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
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
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
      <div className="mb-14">
        {index && (
          <p className="mb-2 font-mono text-sm tracking-widest text-emerald-400">
            {index}
          </p>
        )}
        <h2 className="font-display text-4xl font-bold uppercase tracking-tight sm:text-6xl">
          {children}
        </h2>
      </div>
    </Reveal>
  );
}
