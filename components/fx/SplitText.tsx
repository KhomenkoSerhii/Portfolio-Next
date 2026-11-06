import { Fragment, type CSSProperties } from "react";

/**
 * Splits text into words or letters for an entrance effect. The full text is the
 * accessible text; the animated pieces are hidden from screen readers. Blank lines
 * start new paragraphs. Plays when an ancestor gets `data-in="true"` (see InView).
 */
export function SplitText({
  text,
  by,
  stagger = by === "chars" ? 32 : 45,
  className,
}: {
  text: string;
  by: "words" | "chars";
  /** ms between pieces */
  stagger?: number;
  className?: string;
}) {
  let index = 0;
  const piece = (content: string, key: number) => (
    <span key={key} className="split-piece" style={{ "--d": `${index++ * stagger}ms` } as CSSProperties}>
      {content}
    </span>
  );
  const paragraphs = text.split(/\n{2,}/);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {paragraphs.map((paragraph, p) => {
          const words = paragraph.split(/\s+/);
          return (
            <span key={p} className={paragraphs.length > 1 ? "split-paragraph" : undefined}>
              {words.map((word, w) => (
                // the space sits between the inline blocks: inside one it would be dropped
                <Fragment key={w}>
                  <span className="split-word">
                    {by === "chars" ? Array.from(word).map((char, c) => piece(char, c)) : piece(word, 0)}
                  </span>
                  {w < words.length - 1 ? " " : null}
                </Fragment>
              ))}
            </span>
          );
        })}
      </span>
    </span>
  );
}
