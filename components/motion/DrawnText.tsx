import type { ReactNode } from "react";

/**
 * A title that is traced as an outline, then filled. Renders the content twice in
 * the same box: the real text, and an aria-hidden outline copy on top. Being the
 * same markup, both wrap identically at every width. Plays with the nearest Blueprint.
 */
export function DrawnText({ children }: { children: ReactNode }) {
  return (
    <span className="drawn">
      <span className="drawn-fill">{children}</span>
      <span aria-hidden="true" className="drawn-line">
        {children}
      </span>
    </span>
  );
}
