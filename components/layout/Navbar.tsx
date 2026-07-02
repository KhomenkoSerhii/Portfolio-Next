"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LINKS = [
  { href: "#experience", id: "experience", label: "Experience" },
  { href: "#skills", id: "skills", label: "Skills" },
  { href: "#recommendations", id: "recommendations", label: "Reviews" },
  { href: "#services", id: "services", label: "Services" },
  { href: "#contact", id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const logoClicks = useRef({ n: 0, t: 0 });
  const pendingScrollRef = useRef<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // scroll-spy: highlight the section currently in view
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  // lock page scroll while the mobile menu is open; scroll after it closes
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (!menuOpen && pendingScrollRef.current) {
      const id = pendingScrollRef.current;
      pendingScrollRef.current = null;
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      });
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function goTo(e: React.MouseEvent, id: string) {
    e.preventDefault();
    pendingScrollRef.current = id;
    setMenuOpen(false);
  }

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled || menuOpen
          ? "border-b border-zinc-900/80 bg-zinc-950/80 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setMenuOpen(false);
            // easter egg: 5 quick clicks dissolve the page into particles
            const now = Date.now();
            if (now - logoClicks.current.t > 2500) logoClicks.current.n = 0;
            logoClicks.current.t = now;
            logoClicks.current.n++;
            if (logoClicks.current.n >= 5) {
              logoClicks.current.n = 0;
              document.body.classList.add("bursting");
              window.dispatchEvent(new Event("egg:burst"));
              setTimeout(
                () => document.body.classList.remove("bursting"),
                2400
              );
              return;
            }
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="font-display text-lg font-extrabold uppercase tracking-tight text-white transition hover:text-emerald-400"
        >
          SK<span className="text-emerald-400">.</span>
        </a>

        {/* desktop links */}
        <ul className="hidden items-center gap-2 sm:flex">
          {LINKS.map(({ href, id, label }) => (
            <li key={id}>
              <a
                href={href}
                className={`rounded-full px-3 py-1.5 font-mono text-sm tracking-wider transition ${
                  active === id
                    ? "bg-emerald-500/15 text-emerald-300"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {label.toUpperCase()}
              </a>
            </li>
          ))}
        </ul>

        {/* hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="relative flex h-10 w-10 items-center justify-center text-white sm:hidden"
        >
          <span
            className={`absolute h-0.5 w-6 rounded bg-current transition-all duration-300 ${
              menuOpen ? "rotate-45" : "-translate-y-2"
            }`}
          />
          <span
            className={`absolute h-0.5 w-6 rounded bg-current transition-all duration-300 ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute h-0.5 w-6 rounded bg-current transition-all duration-300 ${
              menuOpen ? "-rotate-45" : "translate-y-2"
            }`}
          />
        </button>
      </nav>

      {/* mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-zinc-900/80 bg-zinc-950/95 backdrop-blur-md sm:hidden"
          >
            <ul className="space-y-1 px-6 py-5">
              {LINKS.map(({ href, id, label }, i) => (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.05 }}
                >
                  <a
                    href={href}
                    onClick={(e) => goTo(e, id)}
                    className={`block py-3 font-display text-2xl font-bold uppercase tracking-tight transition ${
                      active === id
                        ? "text-emerald-400"
                        : "text-zinc-200 hover:text-emerald-400"
                    }`}
                  >
                    <span className="mr-3 font-mono text-xs text-emerald-500/70">
                      0{i + 1}
                    </span>
                    {label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
