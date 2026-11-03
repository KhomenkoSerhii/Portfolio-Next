"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { works } from "@/lib/data";

const allLinks = [
  { href: "#experience", id: "experience", label: "Experience" },
  { href: "#portfolio", id: "portfolio", label: "Portfolio" },
  { href: "#capabilities", id: "capabilities", label: "Skills" },
  { href: "#reviews", id: "reviews", label: "Reviews" },
  { href: "#contact", id: "contact", label: "Contact" },
] as const;

// the portfolio section renders nothing until it has entries, so hide its link too
const links = allLinks.filter((link) => link.id !== "portfolio" || works.length > 0);

function ThemeIcon({ dark }: { dark: boolean }) {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round">
      {dark ? (
        <>
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
        </>
      ) : (
        <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
      )}
    </svg>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="flex h-10 w-10 items-center justify-center border border-white/30 transition hover:bg-[var(--paper)] hover:text-[var(--ink)]"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -45 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 45 }}
          className="flex"
        >
          <ThemeIcon dark={dark} />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

export default function Navbar() {
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pendingSection = useRef<string | null>(null);

  useEffect(() => {
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

    return () => observer.disconnect();
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
      className="fixed inset-x-0 top-0 z-40 border-b border-white/15 bg-[var(--ink)] text-[var(--paper)]"
    >
      <nav className="section-shell flex h-16 items-center justify-between">
        <a href="#" onClick={handleLogo} className="group flex items-center gap-3" aria-label="Back to top">
          <span className="display flex h-10 w-10 items-center justify-center bg-[var(--paper)] text-sm text-[var(--ink)] transition group-hover:bg-[var(--accent)] group-hover:text-[#0e0e0e]">
            SK
          </span>
          <span className="display hidden text-base sm:block">Serhii Khomenko</span>
        </a>

        <div className="flex items-center gap-2">
          <ul className="mr-3 hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className={`relative px-3 py-2 text-[15px] font-semibold transition ${
                    active === link.id ? "text-white" : "text-white/70 hover:text-white"
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
            className="flex h-10 w-10 flex-col items-center justify-center gap-1 border border-white/30 lg:hidden"
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
            className="overflow-hidden border-t border-white/15 bg-[var(--ink)] lg:hidden"
          >
            <div className="section-shell flex h-full min-h-0 flex-col justify-between overflow-y-auto py-5 sm:py-8">
              <ul>
                {links.map((link) => (
                  <li key={link.id} className="border-b border-white/15">
                    <a
                      href={link.href}
                      onClick={(event) => selectSection(event, link.id)}
                      className="display block py-4 text-3xl sm:py-5 sm:text-4xl"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="shrink-0 pt-5 text-base text-white/70">
                Lviv, Ukraine. Available remotely.
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
