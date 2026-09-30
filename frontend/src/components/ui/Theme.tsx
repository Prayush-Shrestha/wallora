"use client";

import { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from "react";
import { Sun, Moon } from "lucide-react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "wallora_theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // ignore — fall through to default
  }
  return "dark";
}

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Always start as "dark" so the first client render matches the SSR HTML.
  // The stored preference is applied in an effect after hydration —
  // reading localStorage during useState init would render a different
  // Sun/Moon icon on client vs server and throw a hydration mismatch.
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // private mode — theme just won't persist
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

/** Sets the theme class before first paint to avoid a flash. */
export function ThemeScript() {
  const js = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}')||'dark';if(t==='dark'){document.documentElement.classList.add('dark')}document.documentElement.style.colorScheme=t;}catch(e){document.documentElement.classList.add('dark')}})();`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}

/** Sun/moon toggle for the navbar (spec: light + night mode button). */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      onClick={toggle}
      aria-pressed={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to night mode"}
      title={dark ? "Switch to light mode" : "Switch to night mode"}
      className={`p-2 rounded-full text-muted hover:text-strong hover:bg-line/10 transition-colors ${className}`}
    >
      {dark ? <Sun className="w-5 h-5" aria-hidden /> : <Moon className="w-5 h-5" aria-hidden />}
    </button>
  );
}
