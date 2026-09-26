"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Command as CmdIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { site, nav } from "@/content/site";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "./ThemeToggle";
import { LangToggle } from "./LangToggle";

function openPalette() {
  document.dispatchEvent(new CustomEvent("open-command-menu"));
}

/**
 * Top bar. The links are always one click away:
 *  - xl and up: logo, links, and controls share one row.
 *  - md to xl: the same row is too narrow beside the sidebar (it needs ~800px),
 *    so the links get their own second row, like tabs. It scrolls sideways as a
 *    safety net if a translation ever makes it too long.
 *  - below md (phones): the bottom bar plus this menu drawer.
 * The header height per breakpoint lives in --header-h (globals.css), which
 * sticky elements and anchor offsets read, so nothing hides under the bar.
 */
export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations("nav");
  const tc = useTranslations("common");

  const key = (href: string) => href.replace("/", "") as Parameters<typeof t>[0];
  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");

  // Close the drawer on navigation and on Escape.
  useEffect(() => setMobileOpen(false), [pathname]);
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  // Underline grows in on hover and stays on the active page.
  const links = nav.map((n) => (
    <li key={n.href} className="shrink-0">
      <Link
        href={n.href}
        aria-current={active(n.href) ? "page" : undefined}
        className={cn(
          "relative whitespace-nowrap py-1 text-sm transition-colors",
          "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-accent after:transition-transform after:duration-200",
          active(n.href)
            ? "text-ink after:scale-x-100"
            : "text-muted after:scale-x-0 hover:text-ink hover:after:scale-x-100"
        )}
      >
        {t(key(n.href))}
      </Link>
    </li>
  ));

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/80 backdrop-blur-md">
      <nav aria-label={tc("primaryNav")}>
        {/* row 1: logo, (xl) links, controls */}
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="shrink-0 font-mono text-sm font-bold uppercase tracking-widest">
            {site.brand}<span className="text-accent-2">.</span>
          </Link>

          <ul className="hidden min-w-0 items-center gap-5 xl:flex">{links}</ul>

          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={openPalette}
              aria-label={tc("searchCommands")}
              className="hidden items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:text-ink sm:flex"
            >
              <CmdIcon size={13} /> K
            </button>
            <div className="hidden sm:block"><LangToggle /></div>
            <ThemeToggle />
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink md:hidden"
              aria-label={mobileOpen ? tc("closeMenu") : tc("openMenu")}
              aria-expanded={mobileOpen}
              aria-controls="nav-drawer"
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* row 2 (md to xl): every link visible, like tabs */}
        <div className="hidden border-t border-line md:block xl:hidden">
          <ul className="mx-auto flex h-11 max-w-6xl items-center gap-5 overflow-x-auto px-4 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden">
            {links}
          </ul>
        </div>
      </nav>

      {/* drawer (phones only; the bottom bar covers the main destinations too) */}
      {mobileOpen && (
        <div id="nav-drawer" className="border-t border-line md:hidden">
          <ul className="mx-auto max-w-6xl px-4 py-3 sm:columns-2">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={active(n.href) ? "page" : undefined}
                  className={cn(
                    "block py-2.5 text-base",
                    active(n.href) ? "text-ink" : "text-muted"
                  )}
                >
                  {t(key(n.href))}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mx-auto flex max-w-6xl items-center gap-3 border-t border-line px-4 py-3 sm:hidden">
            <LangToggle />
            <button onClick={openPalette} className="rounded-full border border-line px-3 py-1.5 text-xs text-muted">
              {tc("search")}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
