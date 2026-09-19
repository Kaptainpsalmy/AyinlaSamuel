"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Command as CmdIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { site, nav } from "@/content/site";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "./ThemeToggle";
import { LangToggle } from "./LangToggle";

function openPalette() {
  document.dispatchEvent(new CustomEvent("open-command-menu"));
}

export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations("nav");

  const key = (href: string) => href.replace("/", "") as Parameters<typeof t>[0];
  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Primary">
        <Link href="/" className="font-mono text-sm font-bold uppercase tracking-widest">
          {site.brand}<span className="text-accent-2">.</span>
        </Link>

        {/* desktop links */}
        <ul className="hidden items-center gap-6 md:flex">
          {nav.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                aria-current={active(n.href) ? "page" : undefined}
                className={cn(
                  "text-sm transition-colors",
                  active(n.href) ? "text-ink" : "text-muted hover:text-ink"
                )}
              >
                {t(key(n.href))}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={openPalette}
            aria-label="Search and commands"
            className="hidden items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:text-ink sm:flex"
          >
            <CmdIcon size={13} /> K
          </button>
          <div className="hidden sm:block"><LangToggle /></div>
          <ThemeToggle />
          <button
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-line md:hidden">
          <ul className="mx-auto max-w-6xl px-4 py-3">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  onClick={() => setMobileOpen(false)}
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
            <li className="mt-3 flex items-center gap-3 border-t border-line pt-3">
              <LangToggle />
              <button onClick={openPalette} className="rounded-full border border-line px-3 py-1.5 text-xs text-muted">
                Search
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
