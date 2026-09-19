/**
 * Command registry shape for the palette. Matches the reference site's action set:
 * navigate, copy-email, download-cv, view-now, ask-ai, match-jd, socials, theme, language.
 * Data driven so pages can contribute their own commands later.
 */
import type { LucideIcon } from "lucide-react";

export type CommandItem = {
  id: string;
  label: string;
  group: "navigate" | "actions" | "social";
  keywords?: string[];
  href?: string;
  external?: boolean;
  run?: () => void | Promise<void>;
  icon?: LucideIcon;
};
