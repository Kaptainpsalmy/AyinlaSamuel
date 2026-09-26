// Message namespaces sent to the browser. Server components translate on the
// server, so only the namespaces client components read need to ship with each
// page. scripts/check-i18n.mjs fails the build if a useTranslations("x") call
// names a namespace missing from this list.
export const clientNamespaces = [
  "ai", "api", "arch", "command", "common", "contactForm", "contrib", "cv",
  "filters", "gallery", "game", "hero", "mobileNav", "nav", "note", "notes",
  "now", "projectType", "reel", "share", "signals", "views",
] as const;
