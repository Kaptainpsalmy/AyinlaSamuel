"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useActive } from "@/components/motion/useActive";
import { ApiPulse } from "./ApiPulse";
import { LiveTerminal } from "./LiveTerminal";

const ROTATE_MS = 120_000; // swap views every 2 minutes

export function RotatingHero() {
  const t = useTranslations("hero");
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const active = useActive(ref);
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<0 | 1>(0);
  useEffect(() => setMounted(true), []);

  // Only rotate while the hero is on screen; reduced motion keeps one static view.
  useEffect(() => {
    if (reduce || !active) return;
    const iv = setInterval(() => setView((v) => (v === 0 ? 1 : 0)), ROTATE_MS);
    return () => clearInterval(iv);
  }, [reduce, active]);

  return (
    // min-w-0: as a grid item this column may shrink below its content width.
    <div ref={ref} className="relative min-w-0">
      <div style={{ transition: reduce ? undefined : "opacity 0.6s ease", opacity: view === 0 ? 1 : 0, position: view === 0 ? "relative" : "absolute", inset: 0 }}>
        <ApiPulse active={active && view === 0} />
      </div>
      {mounted && !reduce && (
        <div style={{ transition: "opacity 0.6s ease", opacity: view === 1 ? 1 : 0, position: view === 1 ? "relative" : "absolute", inset: 0 }}>
          <LiveTerminal active={active && view === 1} />
        </div>
      )}
      {mounted && !reduce && (
        // The pills are 6px tall but each button is a 24px square, the minimum
        // comfortable tap target. The margins keep the pills where they were.
        <div className="-mb-[9px] mt-[3px] flex justify-center">
          {[0, 1].map((i) => (
            <button
              key={i}
              onClick={() => setView(i as 0 | 1)}
              aria-label={i === 0 ? t("showPulse") : t("showTerminal")}
              aria-pressed={view === i}
              className="grid h-6 min-w-6 place-items-center"
            >
              <span className={"h-1.5 rounded-full transition-all " + (view === i ? "w-6 bg-accent" : "w-1.5 bg-line")} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
