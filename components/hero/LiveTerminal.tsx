"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

// Console output stays in English on purpose: it is code, like the notes' code blocks.
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
  ["", "Ayinla Samuel, full-stack engineer (backend + AI)"],
];
const cls: Record<string, string> = { k: "text-accent-2", g: "text-ok", y: "text-warn", "": "text-muted" };

/**
 * Types the boot log line by line, then loops. The typing position lives in a
 * ref so pausing (while `active` is false) and resuming picks up where it left
 * off, and every pending timer is cancelled on pause or unmount.
 */
export function LiveTerminal({ active = true }: { active?: boolean }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState<number>(0);
  const [typed, setTyped] = useState("");
  const pos = useRef({ li: 0, ci: 0 });

  useEffect(() => {
    if (reduce) {
      setShown(lines.length);
      return;
    }
    if (!active) return;

    let timer: ReturnType<typeof setTimeout>;
    const schedule = (fn: () => void, ms: number) => {
      timer = setTimeout(fn, ms);
    };
    const tick = () => {
      const p = pos.current;
      if (p.li >= lines.length) {
        schedule(() => {
          pos.current = { li: 0, ci: 0 };
          setShown(0);
          setTyped("");
          tick();
        }, 2600);
        return;
      }
      const [, txt] = lines[p.li];
      setTyped(txt.slice(0, p.ci));
      if (p.ci <= txt.length) {
        p.ci++;
        schedule(tick, txt[p.ci - 1] === " " ? 12 : 26);
      } else {
        setShown(p.li + 1);
        p.li++;
        p.ci = 0;
        setTyped("");
        schedule(tick, 250);
      }
    };
    schedule(tick, 400);
    return () => clearTimeout(timer);
  }, [reduce, active]);

  return (
    <div className="theme-dark overflow-hidden rounded-2xl border border-line bg-[#0a0a0c]">
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-[11px] text-muted">samuel@psalmnova ~</span>
      </div>
      <div className="min-h-[220px] p-4 font-mono text-xs leading-relaxed">
        {lines.slice(0, shown).map(([c, text], i) => (
          <div key={i} className={cls[c]}>{text}</div>
        ))}
        {!reduce && shown < lines.length && (
          <div className={cls[lines[shown][0]]}>{typed}<span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-accent-2 align-middle" /></div>
        )}
      </div>
    </div>
  );
}
