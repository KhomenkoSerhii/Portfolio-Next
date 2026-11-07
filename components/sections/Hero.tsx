"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { profile } from "@/lib/data";
import { useTheme } from "@/lib/theme/ThemeProvider";
import HeroStage, { type StageStats } from "@/components/hero/HeroStage";
import type { RenderMode, TimeMode } from "@/components/hero/scene";
import { Blueprint } from "@/components/motion/Blueprint";
import { DrawnText } from "@/components/motion/DrawnText";
import { DecodeText } from "@/components/motion/DecodeText";

const MODES: { value: RenderMode; label: string }[] = [
  { value: "ascii", label: "ASCII" },
  { value: "binary", label: "Binary" },
  { value: "blocks", label: "Blocks" },
];
const TIMES: { value: TimeMode; label: string }[] = [
  { value: "now", label: "Now" },
  { value: "lapse", label: "24h in 20s" },
];
const CITIES = ["berlin", "london", "amsterdam", "paris", "warsaw", "stockholm", "lisbon", "new-york", "san-francisco", "tel-aviv"];

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="hero-seg">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

const subscribeWide = (callback: () => void) => {
  const query = window.matchMedia("(min-width: 1024px)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};

/** a few lines of "production" log beside the figure; decoration, so screen readers skip it */
function useLog(stats: StageStats | null) {
  const [lines, setLines] = useState<string[]>([]);
  const statsRef = useRef(stats);
  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const startedAt = performance.now();
    let n = 0;
    const id = window.setInterval(() => {
      n++;
      const t = ((performance.now() - startedAt) / 1000).toFixed(2).padStart(7, "0");
      const city = CITIES[(n * 7) % CITIES.length];
      const fps = statsRef.current?.fps ?? 60;
      const options = [`lviv → ${city}`, `ws  open  ${city}`, `render  ${fps} fps   cell 14px`, `sun  ${statsRef.current?.label ?? ""}`];
      const pick = options[n % options.length];
      setLines((previous) => [...previous.slice(-7), `> t+${t}  ${pick}`]);
    }, 260);
    return () => window.clearInterval(id);
  }, []);

  return lines;
}

export default function Hero() {
  const { theme } = useTheme();
  const [mode, setMode] = useState<RenderMode>("ascii");
  const [time, setTime] = useState<TimeMode>("now");
  const [stats, setStats] = useState<StageStats | null>(null);
  const [supported, setSupported] = useState(true);
  // intro: a clean screen, then the title draws itself, then everything else fades in
  const [phase, setPhase] = useState<"title" | "all">("title");
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // the title draws and the text planet assembles in about two seconds, the rest follows
    const id = window.setTimeout(() => setPhase("all"), reduced ? 0 : 1300);
    return () => window.clearTimeout(id);
  }, []);
  const wide = useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => true
  );
  const lines = useLog(stats);
  const onUnsupported = useCallback(() => setSupported(false), []);

  return (
    <section id="about" className="hero-planet" data-supported={supported} data-phase={phase}>
      {supported ? (
        <HeroStage
          mode={mode}
          time={time}
          dark={theme === "dark"}
          wide={wide}
          onStats={setStats}
          onUnsupported={onUnsupported}
        />
      ) : null}

      <div className="hero-bar">
        {/* resolves out of glyphs while the title draws, rather than sitting there from the first frame */}
        <p className="hero-role">
          <DecodeText text="Senior Software Engineer · React, Next.js, Node.js" delay={350} />
        </p>
        <span className="hero-status" aria-hidden="true">
          {stats?.label ? <span>{stats.label}</span> : null}
          <span className="hero-live">
            Live · {stats?.cell ?? 14}px · {stats?.fps ?? 60} fps
          </span>
        </span>
      </div>

      <div className="hero-log" aria-hidden="true">
        {lines.map((line, index) => (
          <div key={`${index}-${line}`} style={{ opacity: 0.25 + (0.75 * index) / Math.max(lines.length, 1) }}>
            {line}
          </div>
        ))}
      </div>

      <Blueprint className="hero-copy">
        <h1 className="hero-title display" data-bp-box>
          <DrawnText>
            Built from zero. <span className="hero-title-accent">Still in production.</span>
          </DrawnText>
        </h1>
        {/* the same line circles the planet; the planet is decoration, so say it here too */}
        <p className="sr-only">Built in Lviv. Running worldwide.</p>
        <div className="hero-later mt-8 flex flex-wrap items-center gap-3">
          <a href="#portfolio" className="button-primary">
            View work
          </a>
          <a href={profile.cvUrl} download className="button-secondary">
            Download CV
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="button-secondary">
            LinkedIn ↗
          </a>
        </div>
      </Blueprint>

      {supported ? (
        <div className="hero-controls">
          <Segmented label="Time" options={TIMES} value={time} onChange={setTime} />
          <Segmented label="Render mode" options={MODES} value={mode} onChange={setMode} />
        </div>
      ) : null}
    </section>
  );
}
