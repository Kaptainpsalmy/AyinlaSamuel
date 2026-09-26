"use client";
import { useEffect, useState, type RefObject } from "react";

/**
 * True while the element is on screen AND the browser tab is visible. Looping
 * animations use it to stop working when nobody can see them, which saves CPU
 * and battery and keeps them from racing ahead in a background tab.
 */
export function useActive(ref: RefObject<Element | null>): boolean {
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.1,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState === "visible");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return inView && tabVisible;
}
