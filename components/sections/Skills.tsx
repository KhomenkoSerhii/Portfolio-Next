"use client";

import { motion } from "framer-motion";
import { skillTiers, type SkillEntry } from "@/lib/data";
import { Reveal, SectionTitle } from "@/components/ui/Reveal";

function SkillRow({
  skill,
  accent,
  delay,
  compact = false,
}: {
  skill: SkillEntry;
  accent: "default" | "ai";
  delay: number;
  compact?: boolean;
}) {
  return (
    <div className="group flex items-center gap-3 py-1.5">
      <span
        className={`shrink-0 truncate font-mono tracking-wide text-zinc-600 transition group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-white ${
          compact ? "w-24 text-[11px] sm:w-28" : "w-36 text-xs sm:w-44 sm:text-sm"
        }`}
      >
        {skill.name}
      </span>
      {/* segmented meter */}
      <div className="relative h-2 flex-1 overflow-hidden rounded-sm bg-zinc-200 dark:bg-zinc-800/50 [mask-image:repeating-linear-gradient(90deg,black_0_10px,transparent_10px_13px)]">
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
      {!compact && (
        <span className="w-14 shrink-0 text-right font-mono text-[10px] text-zinc-500">
          {skill.years}
        </span>
      )}
    </div>
  );
}

function TileHeader({
  label,
  note,
  accent,
}: {
  label: string;
  note: string;
  accent: "default" | "ai";
}) {
  return (
    <div className="mb-3 flex items-baseline justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800/80">
      <p
        className={`font-mono text-xs tracking-widest ${
          accent === "ai" ? "text-cyan-500 dark:text-cyan-300" : "text-emerald-500 dark:text-emerald-400"
        }`}
      >
        {label}
      </p>
      <p className="font-mono text-[10px] text-zinc-400 dark:text-zinc-600">
        {note.toUpperCase()}
      </p>
    </div>
  );
}

const tileCls =
  "flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-emerald-500/30 dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:hover:border-emerald-500/30";

export default function Skills() {
  const [everyDay, currentFocus, inProduction, handsOn] = skillTiers;

  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-28">
      <SectionTitle index="02 - TOOLKIT">Skills</SectionTitle>
      <p className="-mt-8 mb-10 max-w-xl text-sm text-zinc-500 dark:text-zinc-400">
        Tile size = how much of my working time each area gets today. Bar
        length = proficiency, years of hands-on experience on the right.
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* EVERY DAY - the anchor tile, largest */}
        <Reveal className="lg:col-span-2 lg:row-span-2">
          <div className={`${tileCls} h-full justify-center`}>
            <TileHeader
              label={everyDay.label}
              note={everyDay.note}
              accent={everyDay.accent}
            />
            {everyDay.items.map((skill, i) => (
              <SkillRow
                key={skill.name}
                skill={skill}
                accent={everyDay.accent}
                delay={0.1 + i * 0.05}
              />
            ))}
          </div>
        </Reveal>

        {/* CURRENT FOCUS - accent tile, second most prominent */}
        <Reveal delay={0.05} className="lg:col-span-2">
          <div
            className={`${tileCls} border-cyan-500/25 hover:border-cyan-400/50 dark:border-cyan-500/25 dark:hover:border-cyan-400/50`}
          >
            <TileHeader
              label={currentFocus.label}
              note={currentFocus.note}
              accent={currentFocus.accent}
            />
            {currentFocus.items.map((skill, i) => (
              <SkillRow
                key={skill.name}
                skill={skill}
                accent={currentFocus.accent}
                delay={0.15 + i * 0.05}
              />
            ))}
          </div>
        </Reveal>

        {/* IN PRODUCTION - compact rows, no per-item years */}
        <Reveal delay={0.1} className="lg:col-span-2">
          <div className={tileCls}>
            <TileHeader
              label={inProduction.label}
              note={inProduction.note}
              accent={inProduction.accent}
            />
            <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
              {inProduction.items.map((skill, i) => (
                <SkillRow
                  key={skill.name}
                  skill={skill}
                  accent={inProduction.accent}
                  delay={0.2 + i * 0.03}
                  compact
                />
              ))}
            </div>
          </div>
        </Reveal>

        {/* HANDS-ON - lowest density, tag cloud instead of meters */}
        <Reveal delay={0.15} className="lg:col-span-4">
          <div className={tileCls}>
            <TileHeader
              label={handsOn.label}
              note={handsOn.note}
              accent={handsOn.accent}
            />
            <div className="flex flex-wrap gap-2 pt-1">
              {handsOn.items.map((skill) => (
                <span
                  key={skill.name}
                  className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 font-mono text-xs text-zinc-500 transition hover:border-emerald-500/30 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
