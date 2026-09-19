"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const lines: [string, string][] = [
  ["k", "$ uvicorn app.main:app --reload"],
  ["g", "OK  FastAPI runtime started :8000"],
  ["", "->  loading model all-MiniLM-L6-v2 ..."],
  ["g", "OK  embeddings ready (384-dim)"],
  ["", "->  connecting Neon Postgres + pgvector"],
  ["g", "OK  database online"],
  ["y", "*   RAG index: 1,240 chunks warmed"],
  ["g", "OK  health check -> 200"],
  ["k", "$ whoami"],
  ["", "Ayinla Samuel, Backend & AI Engineer"],
];
const cls: Record<string, string> = { k: "text-accent-2", g: "text-ok", y: "text-warn", "": "text-muted" };

export function LiveTerminal() {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState<number>(0);
  const [typed, setTyped] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) { setShown(lines.length); return; }
    let li = 0, ci = 0;
    const tick = () => {
      if (li >= lines.length) { setTimeout(() => { li = 0; ci = 0; setShown(0); setTyped(""); tick(); }, 2600); return; }
      const [, txt] = lines[li];
      setTyped(txt.slice(0, ci));
      if (ci <= txt.length) { ci++; setTimeout(tick, txt[ci - 1] === " " ? 12 : 26); }
      else { setShown(li + 1); li++; ci = 0; setTyped(""); setTimeout(tick, 250); }
    };
    const start = setTimeout(tick, 400);
    return () => clearTimeout(start);
  }, [reduce]);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-[#0a0a0c]">
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-[11px] text-muted">samuel@psalmnova ~</span>
      </div>
      <div ref={ref} className="min-h-[220px] p-4 font-mono text-xs leading-relaxed">
        {lines.slice(0, shown).map(([c, t], i) => (
          <div key={i} className={cls[c]}>{t}</div>
        ))}
        {!reduce && shown < lines.length && (
          <div className={cls[lines[shown][0]]}>{typed}<span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-accent-2 align-middle" /></div>
        )}
      </div>
    </div>
  );
}
