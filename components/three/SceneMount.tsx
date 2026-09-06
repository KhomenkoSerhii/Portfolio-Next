"use client";

import { useEffect, useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";

const GlobalScene = dynamic(() => import("./GlobalScene"), { ssr: false });

/**
 * Defers mounting the 3D scene until the page has fully loaded (+ a beat),
 * so the hero text paints first and Lighthouse LCP/Speed Index aren't
 * competing with WebGL initialisation.
 */
export default function SceneMount({ levels = [] }: { levels?: number[] }) {
  const [ready, setReady] = useState(false);
  const [webgl, setWebgl] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const arm = () => {
      timer = setTimeout(() => {
        const canvas = document.createElement("canvas");
        const context =
          canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ??
          canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true });
        setWebgl(Boolean(context));
        setReady(true);
      }, 300);
    };
    if (document.readyState === "complete") {
      arm();
    } else {
      window.addEventListener("load", arm, { once: true });
    }
    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", arm);
    };
  }, []);

  const visualLevels = levels.slice(-84);

  return (
    <div className="absolute inset-0">
      <div className="terrain-fallback" aria-hidden>
        <div className="terrain-fallback-grid">
          {Array.from({ length: 84 }, (_, index) => {
            const source = visualLevels[index] ?? ((index * 31 + index * index * 7) % 5);
            const level = Math.max(0, Math.min(4, source));
            return (
              <span
                key={index}
                className={`terrain-fallback-cell level-${level}`}
                style={{ "--cell-height": `${5 + level * 10}px` } as CSSProperties}
              />
            );
          })}
        </div>
      </div>
      {ready && webgl ? <GlobalScene levels={levels} /> : null}
    </div>
  );
}
