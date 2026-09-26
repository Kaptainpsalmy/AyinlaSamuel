"use client";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const t = useTranslations("common");
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? t("switchToLight") : t("switchToDark")}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:text-ink"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
