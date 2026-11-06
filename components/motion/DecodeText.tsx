"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/hooks/useInViewOnce";
import { useBlueprintRun } from "./Blueprint";

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghkmnpqrstuvwxyz0123456789#%&<>/{}=+";
const WINDOW = 8; // random glyphs running ahead of the settled text
const TICK_MS = 32;

const escape = (char: string) => (char === "<" ? "&lt;" : char === ">" ? "&gt;" : char === "&" ? "&amp;" : char);

/** one frame of the layer: settled text, then a window of random glyphs, then hidden text.
 *  Every character keeps its real width, so the layer wraps exactly like the text under it. */
function frame(text: string, front: number) {
  let html = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (i < front) html += escape(char);
    // the real character keeps its exact width (transparent); the glyph is painted over it
    else if (i < front + WINDOW && char !== " ")
      html += `<span class="x" data-g="${escape(GLYPHS[Math.floor(Math.random() * GLYPHS.length)])}">${escape(char)}</span>`;
    else html += `<span class="h">${escape(char)}</span>`;
  }
  return html;
}

type State = "idle" | "running" | "done";

/**
 * Text that resolves left to right out of random characters. The real text is
 * always in the DOM (transparent while running), so screen readers, search and
 * copy see it unchanged; the glyph layer on top is aria-hidden and removed after.
 * Inside a Blueprint it waits for that blueprint to scroll in; outside one it starts on mount.
 */
export function DecodeText({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  const run = useBlueprintRun();
  const [state, setState] = useState<State>("idle");
  const layerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (state !== "idle") return;
    if (prefersReducedMotion()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState("done");
      return;
    }
    if (run === false) return;
    const timer = window.setTimeout(() => setState("running"), delay);
    return () => window.clearTimeout(timer);
  }, [run, delay, state]);

  useEffect(() => {
    if (state !== "running") return;
    const layer = layerRef.current;
    if (!layer) return;
    const speed = Math.max(1.2, text.length / 32); // long copy sweeps faster
    let front = -WINDOW;
    let timer = 0;
    const tick = () => {
      layer.innerHTML = frame(text, front);
      front += speed;
      if (front <= text.length) timer = window.setTimeout(tick, TICK_MS);
      else setState("done");
    };
    tick();
    return () => window.clearTimeout(timer);
  }, [state, text]);

  return (
    <span className={`decode ${className ?? ""}`} data-decode={state}>
      {text}
      {state === "running" ? <span ref={layerRef} aria-hidden="true" className="decode-layer" /> : null}
    </span>
  );
}
