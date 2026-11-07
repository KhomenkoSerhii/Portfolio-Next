"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/hooks/useInViewOnce";

/**
 * A tall block whose content sticks while its words light up one by one with the
 * scroll. `text` is read out whole; the lit words are decoration.
 */
export function ScrollWords({ text, punch, footer }: { text: string; punch?: string; footer?: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const words = text.split(" ");
  const punchWords = punch ? punch.split(" ") : [];
  const total = words.length + punchWords.length;
  const [lit, setLit] = useState(total);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || prefersReducedMotion()) return;
    let frame = 0;
    const update = () => {
      const box = wrap.getBoundingClientRect();
      const travel = Math.max(box.height - window.innerHeight, 1);
      const progress = Math.min(Math.max(-box.top / travel, 0), 1);
      setLit(Math.round(progress * total * 1.15));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [total]);

  return (
    <div ref={wrapRef} className="scroll-words">
      <div className="scroll-words-sticky">
        <blockquote className="scroll-words-text">
          <span className="sr-only">
            {text} {punch}
          </span>
          <span aria-hidden="true">
            {words.map((word, i) => (
              <span key={`w${i}`} className={i < lit ? "is-lit" : undefined}>
                {word}{" "}
              </span>
            ))}
            {punchWords.map((word, i) => (
              <span key={`p${i}`} className={`display font-extrabold ${words.length + i < lit ? "is-lit" : ""}`}>
                {word}
                {i < punchWords.length - 1 ? " " : ""}
              </span>
            ))}
          </span>
        </blockquote>
        {footer}
      </div>
    </div>
  );
}
