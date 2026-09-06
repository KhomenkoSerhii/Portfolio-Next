"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/lib/theme/ThemeProvider";

const links = [
  { href: "#work", id: "work", label: "Work" },
  { href: "#activity", id: "activity", label: "Activity" },
  { href: "#experience", id: "experience", label: "Experience" },
  { href: "#capabilities", id: "capabilities", label: "Capabilities" },
  { href: "#reviews", id: "reviews", label: "Reviews" },
  { href: "#contact", id: "contact", label: "Contact" },
] as const;

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="flex h-9 w-9 items-center justify-center border border-[var(--line-strong)] transition hover:bg-[var(--foreground)] hover:text-[var(--background)]"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -45 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 45 }}
          className="font-mono text-sm"
        >
          {dark ? "☼" : "◐"}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

export default function Navbar() {
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pendingSection = useRef<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-42% 0px -52% 0px" }
    );

    for (const link of links) {
      const element = document.getElementById(link.id);
      if (element) observer.observe(element);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (!menuOpen && pendingSection.current) {
      const id = pendingSection.current;
      pendingSection.current = null;
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      });
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function selectSection(event: React.MouseEvent, id: string) {
    if (!menuOpen) return;
    event.preventDefault();
    pendingSection.current = id;
    setMenuOpen(false);
  }

  function handleLogo(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <motion.header
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, delay: 0.15 }}
      className={`fixed inset-x-0 top-0 z-40 border-b transition-colors ${
        scrolled || menuOpen
          ? "border-[var(--line-strong)] bg-[var(--background)]/92 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="section-shell flex h-16 items-center justify-between">
        <a href="#" onClick={handleLogo} className="group flex items-center gap-3" aria-label="Back to top">
          <span className="flex h-9 w-9 items-center justify-center bg-[var(--foreground)] font-display text-xs font-extrabold text-[var(--background)] transition group-hover:bg-[var(--accent)] group-hover:text-[#11150d]">
            SK
          </span>
          <span className="hidden font-mono text-[9px] uppercase leading-[1.35] tracking-[0.16em] text-[var(--muted)] xl:block">
            Senior frontend
            <br />
            engineer
          </span>
        </a>

        <div className="flex items-center gap-2">
          <ul className="mr-3 hidden items-center lg:flex">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className={`relative px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] transition ${
                    active === link.id
                      ? "text-[var(--foreground)]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {link.label}
                  {active === link.id ? <span className="absolute inset-x-3 -bottom-[11px] h-0.5 bg-[var(--accent)]" /> : null}
                </a>
              </li>
            ))}
          </ul>

          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1 border border-[var(--line-strong)] lg:hidden"
          >
            <span className={`h-px w-5 bg-current transition-[transform] ${menuOpen ? "translate-y-[5px] rotate-45" : ""}`} />
            <span className={`h-px w-5 bg-current transition-[opacity] ${menuOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`h-px w-5 bg-current transition-[transform] ${menuOpen ? "-translate-y-[5px] -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "calc(100svh - 4rem)", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-[var(--line-strong)] bg-[var(--background)] lg:hidden"
          >
            <div className="section-shell flex h-full min-h-0 flex-col justify-between overflow-y-auto py-5 sm:py-8">
              <ul>
                {links.map((link, index) => (
                  <li key={link.id} className="border-b border-[var(--line)]">
                    <a
                      href={link.href}
                      onClick={(event) => selectSection(event, link.id)}
                      className="flex items-center justify-between py-4 font-display text-2xl font-extrabold uppercase tracking-[-0.04em] sm:py-5 sm:text-3xl"
                    >
                      {link.label}
                      <span className="font-mono text-[10px] text-[var(--muted)]">0{index + 1}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="shrink-0 pt-5 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--muted)]">
                Lviv, Ukraine · Available remotely
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
