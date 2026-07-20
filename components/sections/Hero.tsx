"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/data";
import Magnetic from "@/components/ui/Magnetic";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Hero() {
  return (
    <section className="relative flex min-h-svh items-center overflow-hidden">
      {/* radial glow behind text */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-600/10 blur-[120px]"
      />
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto w-full max-w-5xl px-6"
      >
        <motion.p
          variants={item}
          className="mb-4 font-mono text-sm tracking-widest text-emerald-400"
        >
          {profile.location.toUpperCase()}
        </motion.p>
        <motion.h1
          variants={item}
          className="font-display text-[clamp(2rem,8.5vw,4rem)] font-extrabold uppercase leading-[0.95] tracking-tight sm:text-8xl"
        >
          Serhii
          <br />
          Khomenko
        </motion.h1>
        <motion.h2
          variants={item}
          className="mt-5 bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400 bg-clip-text font-display text-xl font-bold text-transparent sm:text-2xl"
        >
          {profile.role}
        </motion.h2>
        <motion.p
          variants={item}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-200"
        >
          {profile.summary}
        </motion.p>
        <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
          <Magnetic>
            <a
              href="#contact"
              className="inline-block rounded-full bg-emerald-500 px-6 py-3 font-semibold text-emerald-950 transition hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
            >
              Get in touch
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>
    </section>
  );
}
