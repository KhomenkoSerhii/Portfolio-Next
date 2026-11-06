"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type Theme = "dark" | "blue-hour";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  /** `origin` is a viewport point; when given, the new theme grows out of it as a circle */
  setTheme: (theme: Theme, origin?: { x: number; y: number }) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** localStorage key + default kept in sync with the anti-flash script in layout.tsx */
export const THEME_STORAGE_KEY = "theme";
const DEFAULT_THEME: Theme = "blue-hour";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.classList.toggle("blue-hour", theme === "blue-hour");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // The anti-flash script has already set the class on <html> before hydration;
  // read it back so server/client agree without a flash.
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  // keep the latest theme readable inside a stable toggle callback
  const themeRef = useRef(theme);
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    // Read the persisted theme after hydration. We deliberately render the
    // default ("blue-hour") on the server + first client paint to match markup,
    // then correct here — the anti-flash script has already set the real class
    // on <html>, so there's no visual flash, only a state catch-up.
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    // anything else saved earlier (the retired "light" and "calyptus" themes) falls back to the default
    const initial: Theme = stored === "dark" ? stored : DEFAULT_THEME;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const setSelectedTheme = useCallback((next: Theme, origin?: { x: number; y: number }) => {
    window.localStorage.setItem(THEME_STORAGE_KEY, next);

    // Instant swap — suppress element color transitions so there's no fade.
    const swap = () => {
      const freeze = document.createElement("style");
      freeze.appendChild(
        document.createTextNode("*,*::before,*::after{transition:none !important}")
      );
      document.head.appendChild(freeze);
      applyTheme(next);
      setTheme(next);
      requestAnimationFrame(() => freeze.remove());
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!origin || reduced || typeof document.startViewTransition !== "function") {
      swap();
      return;
    }
    // the browser snapshots the old page, we swap, and the CSS in globals.css
    // reveals the new one as a circle from --vt-x/--vt-y
    const root = document.documentElement;
    root.style.setProperty("--vt-x", `${Math.round(origin.x)}px`);
    root.style.setProperty("--vt-y", `${Math.round(origin.y)}px`);
    document.startViewTransition(swap);
  }, []);

  const toggleTheme = useCallback(() => {
    const next: Theme = themeRef.current === "dark" ? "blue-hour" : "dark";
    setSelectedTheme(next);
  }, [setSelectedTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: setSelectedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
