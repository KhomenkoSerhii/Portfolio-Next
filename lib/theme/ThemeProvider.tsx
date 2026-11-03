"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type Theme = "light" | "dark" | "blue-hour";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
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
    const initial: Theme = stored === "light" || stored === "dark" ? stored : DEFAULT_THEME;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const setSelectedTheme = useCallback((next: Theme) => {
    window.localStorage.setItem(THEME_STORAGE_KEY, next);

    // Instant swap — suppress element color transitions so there's no fade.
    const freeze = document.createElement("style");
    freeze.appendChild(
      document.createTextNode("*,*::before,*::after{transition:none !important}")
    );
    document.head.appendChild(freeze);
    applyTheme(next);
    setTheme(next);
    requestAnimationFrame(() => freeze.remove());
  }, []);

  const toggleTheme = useCallback(() => {
    const next: Theme = themeRef.current === "light" ? "dark" : themeRef.current === "dark" ? "blue-hour" : "light";
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
