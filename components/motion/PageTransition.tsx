"use client";
import { ViewTransition } from "react";
import { usePathname } from "next/navigation";

/**
 * Animates the page content on every route change using React's ViewTransition
 * (backed by the browser's View Transitions API). Keying on the pathname makes
 * the old and new page an exit/enter pair; search-param changes (like project
 * filters) keep the same key, so they do not animate. The sidebar, nav, and
 * footer live outside this boundary and stay still. Browsers without support
 * simply navigate instantly. The `page-in` / `page-out` classes are styled in
 * globals.css.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <ViewTransition key={pathname} enter="page-in" exit="page-out" default="none">
      {children}
    </ViewTransition>
  );
}
