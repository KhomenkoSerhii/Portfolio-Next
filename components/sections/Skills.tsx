"use client";

import { motion } from "framer-motion";
import { skillTiers, type SkillEntry } from "@/lib/data";
import { Reveal, SectionTitle } from "@/components/ui/Reveal";

function SkillRow({
  skill,
  accent,
  delay,
}: {
  skill: SkillEntry;
  accent: "default" | "ai";
  delay: number;
}) {
  return (
    <div className="group flex items-center gap-3 py-1.5">
      <span className="w-36 shrink-0 truncate font-mono text-xs tracking-wide text-zinc-300 transition group-hover:text-white sm:w-44 sm:text-sm">
        {skill.name}
      </span>
      {/* segmented meter */}
      <div className="relative h-2 flex-1 overflow-hidden rounded-sm bg-zinc-800/50 [mask-image:repeating-linear-gradient(90deg,black_0_10px,transparent_10px_13px)]">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: skill.level }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full w-full origin-left ${
            accent === "ai"
              ? "bg-gradient-to-r from-violet-400 to-cyan-400"
              : "bg-gradient-to-r from-emerald-500 to-teal-400"
          }`}
        />
      </div>
      <span className="w-14 shrink-0 text-right font-mono text-[10px] text-zinc-500">
        {skill.years}
      </span>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-28">
      <SectionTitle index="02 – TOOLKIT">Skills</SectionTitle>
      <p className="-mt-8 mb-10 max-w-xl text-sm text-zinc-400">
        Bar length = how much of my working time each tool gets today.
        Years of hands-on experience on the right.
      </p>

      <div className="grid gap-x-14 gap-y-10 md:grid-cols-2">
        {skillTiers.map((tier, ti) => (
          <Reveal key={tier.label} delay={ti * 0.05}>
            <div>
              <div className="mb-3 flex items-baseline justify-between border-b border-zinc-800/80 pb-2">
                <p
                  className={`font-mono text-xs tracking-widest ${
                    tier.accent === "ai" ? "text-cyan-300" : "text-emerald-400"
                  }`}
                >
                  {tier.label}
                </p>
                <p className="font-mono text-[10px] text-zinc-600">
                  {tier.note.toUpperCase()}
                </p>
              </div>
              {tier.items.map((skill, i) => (
                <SkillRow
                  key={skill.name}
                  skill={skill}
                  accent={tier.accent}
                  delay={0.15 + i * 0.04}
                />
              ))}
            </div>
          </Reveal>
        ))}
      </div>

    </section>
  );
}
