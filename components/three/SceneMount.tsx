"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const GlobalScene = dynamic(() => import("./GlobalScene"), { ssr: false });

/**
 * Defers mounting the 3D scene until the page has fully loaded (+ a beat),
 * so the hero text paints first and Lighthouse LCP/Speed Index aren't
 * competing with WebGL initialisation.
 */
export default function SceneMount() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const arm = () => {
      timer = setTimeout(() => setReady(true), 300);
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

  if (!ready) return null;
  return <GlobalScene />;
}
