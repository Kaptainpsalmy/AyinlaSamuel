"use client";
import { useCallback, useEffect, useState } from "react";

const KEY = "recent-commands";
const MAX = 4;

/** Remembers the last few command ids a viewer ran, in localStorage. Edge-safe. */
export function useRecentCommands() {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, []);

  const push = useCallback((id: string) => {
    setRecent((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, MAX);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  return { recent, push };
}
