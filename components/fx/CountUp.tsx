"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion, useInViewOnce } from "@/lib/hooks/useInViewOnce";

/** counts from 0 to `to` when scrolled into view; the final value is always the accessible text */
export function CountUp({ to, suffix = "", duration = 1400 }: { to: number; suffix?: string; duration?: number }) {
  const [ref, inView] = useInViewOnce<HTMLSpanElement>();
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!inView) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(0);
      return;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      <span className="sr-only">
        {to}
        {suffix}
      </span>
      <span aria-hidden="true">
        {value}
        {suffix}
      </span>
    </span>
  );
}
