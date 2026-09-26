"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// The palette (cmdk plus every command) is not part of the page load: it
// mounts on the first Cmd/Ctrl+K or "open-command-menu" event. Its code (about
// 20 KB gzipped) is fetched in the background once the browser is idle, so that
// first open is instant; browsers without requestIdleCallback fetch it on first
// use instead. Once mounted it stays mounted and listens for those triggers itself.
const loadMenu = () => import("./CommandMenu").then((m) => m.CommandMenu);
const CommandMenu = dynamic(loadMenu, { ssr: false });

export function LazyCommandMenu() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!("requestIdleCallback" in window)) return;
    const id = requestIdleCallback(() => void loadMenu(), { timeout: 8000 });
    return () => cancelIdleCallback(id);
  }, []);

  useEffect(() => {
    if (loaded) return;
    const load = () => setLoaded(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key && e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        load();
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("open-command-menu", load);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("open-command-menu", load);
    };
  }, [loaded]);

  return loaded ? <CommandMenu defaultOpen /> : null;
}
