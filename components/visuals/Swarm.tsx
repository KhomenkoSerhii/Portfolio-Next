"use client";

import { useEffect, useRef } from "react";
import type { SwarmFigure } from "./swarm/scene";

/**
 * A field of points behind a section's content that gathers into `figure` when
 * the section scrolls in. three.js loads only when the section gets close.
 */
export default function Swarm({ figure }: { figure: SwarmFigure }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      if (!document.createElement("canvas").getContext("webgl2")) return;
    } catch {
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let cleanup = () => {};

    // load and build only when the section is within a screen of the viewport
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        near.disconnect();
        import("./swarm/scene").then(({ createSwarm }) => {
          if (disposed) return;
          const swarm = createSwarm(canvas, figure);
          const size = () => swarm.resize(canvas.clientWidth, canvas.clientHeight);
          size();
          const resize = new ResizeObserver(size);
          resize.observe(canvas);
          const visible = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
              swarm.gather(reduced);
              if (!reduced) swarm.start();
            } else swarm.stop();
          });
          visible.observe(canvas);
          cleanup = () => {
            resize.disconnect();
            visible.disconnect();
            swarm.dispose();
          };
        });
      },
      { rootMargin: "100% 0px" }
    );
    near.observe(canvas);
    return () => {
      disposed = true;
      near.disconnect();
      cleanup();
    };
  }, [figure]);

  return <canvas ref={canvasRef} aria-hidden="true" className="swarm-canvas" />;
}
