"use client";

import { createContext, useContext, useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react";
import { prefersReducedMotion } from "@/lib/hooks/useInViewOnce";

// true once the nearest Blueprint has scrolled in; null when there is no Blueprint above
const BlueprintContext = createContext<boolean | null>(null);

export function useBlueprintRun(): boolean | null {
  return useContext(BlueprintContext);
}

type BlueprintProps = ComponentPropsWithoutRef<"div"> & {
  as?: "section" | "div" | "header";
  /** faint grid behind the content while the outlines draw */
  grid?: boolean;
};

/**
 * Content that first appears as a blueprint: a grid and dashed outlines around
 * every `[data-bp-box]` child, then the real content. Plays once, when it scrolls
 * into view. Children read the trigger through `useBlueprintRun` or `data-bp`.
 */
export function Blueprint({ as = "div", grid = true, className, children, ...rest }: BlueprintProps) {
  // the tags take the same props; typing it as one keeps the ref and children checks simple
  const Tag = as as "div";
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRun(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRun(true);
          observer.disconnect();
        }
      },
      // the top of a tall block counts; a percentage threshold would never fire on one taller than the viewport
      { rootMargin: "0px 0px -15% 0px", threshold: 0 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <BlueprintContext.Provider value={run}>
      <Tag ref={ref} data-bp={run ? "run" : "idle"} className={`blueprint ${className ?? ""}`} {...rest}>
        {grid ? <span aria-hidden className="bp-grid" /> : null}
        {children}
      </Tag>
    </BlueprintContext.Provider>
  );
}
