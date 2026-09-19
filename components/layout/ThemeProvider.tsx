"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";
const ThemeCtx = createContext<{ theme: Theme; toggle: () => void; set: (t: Theme) => void } | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  // sync from the DOM attribute the inline script already set (no flash)
  useEffect(() => {
    const current = (document.documentElement.getAttribute("data-theme") as Theme) || "dark";
    setTheme(current);
  }, []);

  const apply = useCallback((t: Theme) => {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("theme", t); } catch {}
    setTheme(t);
  }, []);

  const toggle = useCallback(() => apply(theme === "dark" ? "light" : "dark"), [theme, apply]);

  return <ThemeCtx.Provider value={{ theme, toggle, set: apply }}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
