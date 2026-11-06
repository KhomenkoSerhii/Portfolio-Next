"use client";

import { useEffect, useRef, useState } from "react";
import type { HeroScene, RenderMode, TimeMode } from "./scene";

export type StageStats = { fps: number; label: string; cell: number };

type Props = {
  mode: RenderMode;
  time: TimeMode;
  dark: boolean;
  /** true when the figure sits beside the copy (desktop layout) */
  wide: boolean;
  onStats: (stats: StageStats) => void;
  onUnsupported: () => void;
};

function hasWebGL() {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

/**
 * The hero figure: drawn as text on one canvas, and rendered for real on another
 * that only shows through the lens. three.js is loaded after hydration.
 */
export default function HeroStage({ mode, time, dark, wide, onStats, onUnsupported }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const realRef = useRef<HTMLCanvasElement>(null);
  const asciiRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<HeroScene | null>(null);
  const [ready, setReady] = useState(false);
  // latest props, readable from the effect below without re-creating the scene
  const latest = useRef({ mode, time, dark, wide, onStats });
  useEffect(() => {
    latest.current = { mode, time, dark, wide, onStats };
  });

  useEffect(() => {
    const root = rootRef.current;
    const real = realRef.current;
    const ascii = asciiRef.current;
    if (!root || !real || !ascii) return;
    if (!hasWebGL()) {
      onUnsupported();
      return;
    }

    let disposed = false;
    let cleanup = () => {};
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    import("./scene").then(({ createHeroScene }) => {
      if (disposed) return;
      let scene: HeroScene;
      try {
        scene = createHeroScene({
          real,
          ascii,
          assemble: !reduced,
          onStats: (stats) => latest.current.onStats(stats),
        });
      } catch {
        onUnsupported();
        return;
      }
      sceneRef.current = scene;
      scene.setMode(latest.current.mode);
      scene.setTimeMode(latest.current.time);
      scene.setDark(latest.current.dark);
      const size = () => scene.resize(root.clientWidth, root.clientHeight, latest.current.wide);
      size();
      const resizeObserver = new ResizeObserver(size);
      resizeObserver.observe(root);

      // lens: follows the pointer smoothly, drifts on its own when the pointer is away
      const lens = { x: 0.66, y: 0.42, tx: 0.66, ty: 0.42 };
      let inside = false;
      let drag: { x: number; y: number } | null = null;
      let lensFrame = 0;
      const startedAt = performance.now();
      const moveLens = () => {
        const t = (performance.now() - startedAt) / 1000;
        if (!inside && !reduced) {
          const home = latest.current.wide ? { x: 0.68, y: 0.42 } : { x: 0.5, y: 0.5 };
          lens.tx = home.x + Math.sin(t * 0.4) * 0.06;
          lens.ty = home.y + Math.sin(t * 0.65) * 0.08;
        }
        lens.x += (lens.tx - lens.x) * (reduced ? 1 : 0.12);
        lens.y += (lens.ty - lens.y) * (reduced ? 1 : 0.12);
        root.style.setProperty("--lens-x", `${(lens.x * 100).toFixed(2)}%`);
        root.style.setProperty("--lens-y", `${(lens.y * 100).toFixed(2)}%`);
        if (!reduced) lensFrame = requestAnimationFrame(moveLens);
      };

      const onMove = (event: PointerEvent) => {
        const box = root.getBoundingClientRect();
        inside = true;
        lens.tx = (event.clientX - box.left) / box.width;
        lens.ty = (event.clientY - box.top) / box.height;
        if (drag) {
          scene.drag(event.clientX - drag.x, event.clientY - drag.y);
          drag = { x: event.clientX, y: event.clientY };
        }
        if (reduced) moveLens();
      };
      const onDown = (event: PointerEvent) => {
        drag = { x: event.clientX, y: event.clientY };
        scene.dragStart();
      };
      const onUp = () => {
        drag = null;
        scene.dragEnd();
      };
      const onLeave = () => {
        inside = false;
      };
      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerdown", onDown);
      root.addEventListener("pointerleave", onLeave);
      window.addEventListener("pointerup", onUp);

      // only animate while the hero is on screen and the tab is visible
      let visible = true;
      let interval = 0;
      const run = () => {
        const on = visible && document.visibilityState === "visible";
        if (reduced) {
          window.clearInterval(interval);
          // a still picture, refreshed once a second so textures and day/night settle in
          if (on) interval = window.setInterval(scene.renderOnce, 1000);
          scene.renderOnce();
          return;
        }
        if (on) {
          scene.start();
          cancelAnimationFrame(lensFrame);
          lensFrame = requestAnimationFrame(moveLens);
        } else {
          scene.stop();
          cancelAnimationFrame(lensFrame);
        }
      };
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        run();
      });
      observer.observe(root);
      document.addEventListener("visibilitychange", run);
      moveLens();
      run();
      setReady(true);

      cleanup = () => {
        observer.disconnect();
        resizeObserver.disconnect();
        document.removeEventListener("visibilitychange", run);
        root.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerdown", onDown);
        root.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("pointerup", onUp);
        window.clearInterval(interval);
        cancelAnimationFrame(lensFrame);
        scene.dispose();
        sceneRef.current = null;
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [onUnsupported]);

  useEffect(() => sceneRef.current?.setMode(mode), [mode]);
  useEffect(() => sceneRef.current?.setTimeMode(time), [time]);
  useEffect(() => sceneRef.current?.setDark(dark), [dark]);
  useEffect(() => {
    const root = rootRef.current;
    if (root) sceneRef.current?.resize(root.clientWidth, root.clientHeight, wide);
  }, [wide]);

  return (
    <div ref={rootRef} className="hero-stage" data-ready={ready} aria-hidden="true">
      <canvas ref={asciiRef} className="hero-ascii" />
      <canvas ref={realRef} className="hero-real" />
      <div className="hero-lens">
        <span>live view</span>
      </div>
    </div>
  );
}
