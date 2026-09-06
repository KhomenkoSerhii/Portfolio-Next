"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** localStorage key + default kept in sync with the anti-flash script in layout.tsx */
export const THEME_STORAGE_KEY = "theme";
const DEFAULT_THEME: Theme = "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
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
    // default ("dark") on the server + first client paint to match markup,
    // then correct here — the anti-flash script has already set the real class
    // on <html>, so there's no visual flash, only a state catch-up.
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    const initial: Theme = stored === "light" ? "light" : "dark";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggleTheme = useCallback(() => {
    const next: Theme = themeRef.current === "dark" ? "light" : "dark";
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

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
