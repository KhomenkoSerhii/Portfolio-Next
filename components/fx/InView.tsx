"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useInViewOnce } from "@/lib/hooks/useInViewOnce";

type Props = ComponentPropsWithoutRef<"div"> & { as?: "div" | "section" | "article" | "figure" };

/** marks itself `data-in="true"` once scrolled into view; CSS effects key off that */
export function InView({ as = "div", ...rest }: Props) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>();
  // the four tags take the same props; typing it as one keeps the ref check simple
  const Tag = as as "div";
  return <Tag ref={ref} data-in={inView} {...rest} />;
}
