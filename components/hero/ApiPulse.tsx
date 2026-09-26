"use client";
import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";

const methods: [string, string][] = [["GET", "var(--color-accent-2)"], ["POST", "var(--color-ok-ink)"], ["PUT", "var(--color-warn-ink)"]];
const endpoints = [
  "/api/py/now", "/api/py/github/contributions", "/api/py/health",
  "/api/py/projects/sabrecwa", "/api/py/contact", "/api/py/resume",
];
type Req = { id: number; method: string; color: string; ep: string; ms: number };

const seed = (): Req => {
  const [m, color] = methods[Math.floor(Math.random() * methods.length)];
  return { id: Math.random(), method: m, color, ep: endpoints[Math.floor(Math.random() * endpoints.length)], ms: Math.floor(Math.random() * 80 + 8) };
};

/** Simulated request stream. Pauses (stream and bars) while `active` is false. */
export function ApiPulse({ active = true }: { active?: boolean }) {
  const t = useTranslations("hero");
  const reduce = useReducedMotion();
  const [reqs, setReqs] = useState<Req[]>([]);

  // Seed on the client only: Math.random during SSR would cause a hydration mismatch.
  useEffect(() => {
    setReqs([seed(), seed(), seed()]);
  }, []);

  useEffect(() => {
    if (reduce || !active) return;
    const iv = setInterval(() => setReqs((prev) => [seed(), ...prev].slice(0, 5)), 1600);
    return () => clearInterval(iv);
  }, [reduce, active]);

  return (
    <div className="rounded-2xl border border-line bg-card/50 p-5 font-mono text-xs">
      <div className="mb-3 flex items-center gap-2 text-muted">
        <span className="inline-block h-2 w-2 rounded-full bg-ok" /> {t("systemOperational")}
      </div>
      <div className="space-y-1.5">
        {reqs.map((r) => (
          <div key={r.id} className="flex items-center gap-2 rounded-md border border-line bg-canvas/40 px-2.5 py-1.5">
            <span className="w-9 font-bold" style={{ color: r.color }}>{r.method}</span>
            {/* min-w-0 lets the flex item shrink so truncate can work; without it
                a long endpoint forces the panel wider than a phone screen. */}
            <span className="min-w-0 flex-1 truncate text-ink">{r.ep}</span>
            <span className="font-bold text-ok-ink">200</span>
            <span className="text-muted">{r.ms}ms</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            className="h-5 w-1 rounded-sm bg-accent"
            style={
              reduce
                ? { opacity: 0.5 }
                : { animation: `eq 1.1s ${i * 0.09}s ease-in-out infinite`, animationPlayState: active ? "running" : "paused" }
            }
          />
        ))}
      </div>
      <style>{`@keyframes eq{0%,100%{transform:scaleY(.35);opacity:.35}50%{transform:scaleY(1);opacity:1}}`}</style>
    </div>
  );
}
