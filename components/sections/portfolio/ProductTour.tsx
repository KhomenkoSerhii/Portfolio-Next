"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { WorkScreen } from "@/lib/data";

type View = { top: number; height: number; tall: boolean };

const FOCUSABLE = 'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

// how much of the screenshot is visible in the scroller, as fractions of its full height
function measure(scroller: HTMLElement, screen: WorkScreen): View {
  const contentHeight = (scroller.clientWidth * screen.height) / screen.width;
  if (!contentHeight) return { top: 0, height: 1, tall: false };
  return {
    top: scroller.scrollTop / contentHeight,
    height: Math.min(scroller.clientHeight / contentHeight, 1),
    tall: contentHeight > scroller.clientHeight + 4,
  };
}

// thumbnail of the whole screen with a box for the visible part; drag or click to scroll
function Minimap({
  screen,
  view,
  onSeek,
}: {
  screen: WorkScreen;
  view: View;
  onSeek: (fraction: number) => void;
}) {
  const seek = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    onSeek((event.clientY - rect.top) / rect.height);
  };

  return (
    <div className="hidden w-[92px] shrink-0 border-l border-[var(--line)] bg-[var(--surface)] p-2.5 sm:block">
      <p className="mb-2 text-xs font-semibold text-[var(--muted)]">Map</p>
      <div
        className="relative cursor-ns-resize touch-none select-none"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          seek(event);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) seek(event);
        }}
      >
        <Image
          src={screen.src}
          alt=""
          width={screen.width}
          height={screen.height}
          sizes="72px"
          draggable={false}
          className="block h-auto w-full opacity-70"
        />
        <span
          aria-hidden
          className="absolute inset-x-0 border border-[var(--accent)] bg-[var(--accent)]/15"
          style={{ top: `${view.top * 100}%`, height: `${view.height * 100}%` }}
        />
      </div>
    </div>
  );
}

export function ProductTour({
  name,
  label = "Product tour",
  host,
  screens,
  index,
  onIndexChange,
  onClose,
  origin = null,
}: {
  name: string;
  label?: string;
  host: string;
  screens: WorkScreen[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  /** on-screen box of the deck that opened the tour; the tour grows out of it */
  origin?: DOMRect | null;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>({ top: 0, height: 1, tall: false });
  const reducedMotion = useReducedMotion();
  const screen = screens[index];
  const count = screens.length;

  const go = useCallback(
    (step: number) => onIndexChange((index + step + count) % count),
    [index, count, onIndexChange]
  );

  // lock page scroll, focus the dialog, and hand focus back to the opener on close
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      root.style.overflow = overflow;
      opener?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") go(1);
      else if (event.key === "ArrowLeft") go(-1);
      else if (event.key === "Tab") {
        // keep Tab inside the dialog
        const items = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
        if (!items?.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  // every screen starts at its top; keep the map box in sync with size changes
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTop = 0;
    const update = () => setView(measure(scroller, screen));
    update();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(update);
    observer.observe(scroller);
    return () => observer.disconnect();
  }, [screen]);

  const seek = (fraction: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const contentHeight = (scroller.clientWidth * screen.height) / screen.width;
    scroller.scrollTop = fraction * contentHeight - scroller.clientHeight / 2;
  };

  // closed state: clipped to the deck's box when we know it, otherwise just transparent
  const collapsed =
    origin && !reducedMotion
      ? {
          opacity: 1,
          clipPath: `inset(${Math.max(origin.top, 0)}px ${Math.max(window.innerWidth - origin.right, 0)}px ${Math.max(
            window.innerHeight - origin.bottom,
            0
          )}px ${Math.max(origin.left, 0)}px)`,
        }
      : { opacity: 0, clipPath: "inset(0px 0px 0px 0px)" };

  const counter = `${String(index + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`;

  return createPortal(
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-tour-title"
      initial={collapsed}
      animate={{ opacity: 1, clipPath: "inset(0px 0px 0px 0px)" }}
      exit={collapsed}
      transition={
        reducedMotion
          ? { duration: 0 }
          : origin
            ? { duration: 0.5, ease: [0.65, 0, 0.35, 1] }
            : { duration: 0.25 }
      }
      className="fixed inset-0 z-[100] flex flex-col bg-[var(--background)] text-[var(--foreground)]"
    >
      <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-[var(--line)] px-4 sm:px-6">
        <h2
          id="product-tour-title"
          className="min-w-0 truncate text-[15px] font-medium text-[var(--muted)]"
        >
          <span className="font-bold text-[var(--foreground)]">{name}</span> / {label}
        </h2>
        <div className="flex items-center gap-5">
          <span className="text-sm font-medium tabular-nums text-[var(--muted)]">{counter}</span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="text-[15px] font-semibold transition-colors hover:text-[var(--accent-strong)]"
          >
            Close <span aria-hidden>✕</span>
          </button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] lg:grid-cols-[320px_minmax(0,1fr)]">
        <nav aria-label="Screens" className="hidden overflow-y-auto border-r border-[var(--line)] lg:block">
          <ol>
            {screens.map((item, i) => {
              const current = i === index;
              return (
                <li key={item.src} className="border-b border-[var(--line)]">
                  <button
                    type="button"
                    onClick={() => onIndexChange(i)}
                    aria-current={current ? "step" : undefined}
                    className={`relative w-full px-6 py-5 text-left transition-colors ${
                      current ? "bg-[var(--surface)]" : "hover:bg-[var(--surface)]/60"
                    }`}
                  >
                    {current ? <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 bg-[var(--accent)]" /> : null}
                    <span className={`block text-[15px] font-semibold ${current ? "" : "text-[var(--muted)]"}`}>
                      {item.title}
                    </span>
                    {current ? (
                      <span className="mt-3 block text-sm leading-[1.65] text-[var(--muted)]">{item.caption}</span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="flex min-h-0 flex-col gap-4 p-4 sm:p-6 lg:p-8">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden border border-[var(--line-strong)] bg-[var(--surface)]">
            <div className="flex h-9 shrink-0 items-center gap-3 border-b border-[var(--line)] px-3">
              <span className="flex gap-1.5" aria-hidden>
                <span className="h-2 w-2 rounded-full bg-[var(--line-strong)]" />
                <span className="h-2 w-2 rounded-full bg-[var(--line-strong)]" />
                <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
              </span>
              <span className="min-w-0 flex-1 truncate border border-[var(--line)] bg-[var(--background)] px-3 py-1 text-xs text-[var(--muted)]">
                {host}
                <span className="text-[var(--foreground)]">{screen.path}</span>
              </span>
            </div>

            <div className="flex min-h-0 flex-1">
              <div
                ref={scrollerRef}
                tabIndex={0}
                aria-label={`${screen.title} screenshot, scrollable`}
                onScroll={(event) => setView(measure(event.currentTarget, screen))}
                className={`min-w-0 flex-1 overflow-y-auto overscroll-contain bg-[var(--background)] outline-none ${
                  view.tall ? "" : "flex flex-col justify-center"
                }`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={screen.src}
                    initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reducedMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Image
                      src={screen.src}
                      alt={`${name}: ${screen.title} screen`}
                      width={screen.width}
                      height={screen.height}
                      sizes="(min-width: 1024px) calc(100vw - 480px), 100vw"
                      className="block h-auto w-full"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              {/* always rendered: showing it only for tall screens changes the scroller width,
                  which can flip `tall` back and forth in a resize loop */}
              <Minimap screen={screen} view={view} onSeek={seek} />
            </div>
          </div>

          <p className="text-sm leading-[1.65] text-[var(--muted)] lg:hidden">
            <span className="font-semibold text-[var(--foreground)]">
              {screen.title}.{" "}
            </span>
            {screen.caption}
          </p>

          <div className="flex shrink-0 items-center justify-between gap-3 text-sm font-semibold sm:gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              className="flex min-h-11 flex-1 items-center justify-center border border-[var(--line-strong)] px-4 text-[var(--foreground)] transition-colors hover:border-[var(--accent-strong)] hover:text-[var(--accent-strong)] active:bg-[var(--accent-soft)] sm:min-h-0 sm:flex-none sm:border-0 sm:px-0 sm:active:bg-transparent"
            >
              ← Prev
            </button>
            <span className="hidden font-normal text-[var(--muted)] sm:inline">
              {view.tall ? "Scroll inside the screen · " : ""}← → to switch · Esc to close
            </span>
            <button
              type="button"
              onClick={() => go(1)}
              className="flex min-h-11 flex-1 items-center justify-center bg-[var(--accent)] px-4 text-[var(--accent-ink)] transition-colors active:opacity-80 sm:min-h-0 sm:flex-none sm:bg-transparent sm:px-0 sm:text-[var(--foreground)] sm:hover:text-[var(--accent-strong)] sm:active:opacity-100"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </motion.div>,
    document.body
  );
}
