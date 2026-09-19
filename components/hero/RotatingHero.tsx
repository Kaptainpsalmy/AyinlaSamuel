"use client";
import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ApiPulse } from "./ApiPulse";
import { LiveTerminal } from "./LiveTerminal";

export function RotatingHero() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<0 | 1>(0);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (reduce) return;
    const iv = setInterval(() => setView((v) => (v === 0 ? 1 : 0)), 120000); // 2 min
    return () => clearInterval(iv);
  }, [reduce]);

  return (
    <div className="relative">
      <div style={{ transition: reduce ? undefined : "opacity 0.6s ease", opacity: view === 0 ? 1 : 0, position: view === 0 ? "relative" : "absolute", inset: 0 }}>
        <ApiPulse />
      </div>
      {mounted && !reduce && (
        <div style={{ transition: "opacity 0.6s ease", opacity: view === 1 ? 1 : 0, position: view === 1 ? "relative" : "absolute", inset: 0 }}>
          <LiveTerminal />
        </div>
      )}
      {mounted && !reduce && (
        <div className="mt-3 flex justify-center gap-1.5">
          {[0, 1].map((i) => (
            <button
              key={i}
              onClick={() => setView(i as 0 | 1)}
              aria-label={i === 0 ? "Show API pulse" : "Show terminal"}
              aria-pressed={view === i}
              className={"h-1.5 rounded-full transition-all " + (view === i ? "w-6 bg-accent" : "w-1.5 bg-line")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
