"use client";
import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

const methods: [string, string][] = [["GET", "var(--color-accent-2)"], ["POST", "var(--color-ok)"], ["PUT", "var(--color-warn)"]];
const endpoints = [
  "/api/py/now", "/api/py/github/contributions", "/api/py/health",
  "/api/py/projects/sabrecwa", "/api/py/contact", "/api/py/resume",
];
type Req = { id: number; method: string; color: string; ep: string; ms: number };

export function ApiPulse() {
  const reduce = useReducedMotion();
  const seed = (): Req => {
    const [m, color] = methods[Math.floor(Math.random() * methods.length)];
    return { id: Math.random(), method: m, color, ep: endpoints[Math.floor(Math.random() * endpoints.length)], ms: Math.floor(Math.random() * 80 + 8) };
  };
  const [reqs, setReqs] = useState<Req[]>([]);

  useEffect(() => {
    // seed on the client only (Math.random must not run during SSR -> hydration mismatch)
    setReqs([seed(), seed(), seed()]);
    if (reduce) return;
    const iv = setInterval(() => setReqs((prev) => [seed(), ...prev].slice(0, 5)), 1600);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  return (
    <div className="rounded-2xl border border-line bg-card/50 p-5 font-mono text-xs">
      <div className="mb-3 flex items-center gap-2 text-muted">
        <span className="inline-block h-2 w-2 rounded-full bg-ok" /> System operational
      </div>
      <div className="space-y-1.5">
        {reqs.map((r) => (
          <div key={r.id} className="flex items-center gap-2 rounded-md border border-line bg-canvas/40 px-2.5 py-1.5">
            <span className="w-9 font-bold" style={{ color: r.color }}>{r.method}</span>
            <span className="flex-1 truncate text-ink">{r.ep}</span>
            <span className="font-bold text-ok">200</span>
            <span className="text-muted">{r.ms}ms</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="h-5 w-1 rounded-sm bg-accent" style={reduce ? { opacity: 0.5 } : { animation: `eq 1.1s ${i * 0.09}s ease-in-out infinite` }} />
        ))}
      </div>
      <style>{`@keyframes eq{0%,100%{transform:scaleY(.35);opacity:.35}50%{transform:scaleY(1);opacity:1}}`}</style>
    </div>
  );
}
