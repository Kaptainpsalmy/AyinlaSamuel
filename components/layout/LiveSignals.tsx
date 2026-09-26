"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { LiveClock } from "./LiveClock";
import { fetchNow } from "@/lib/api-client";

/**
 * The sidebar's "is this engineer's stuff actually live?" block. The API dot
 * probes /api/py/health; the latest-commit line pulls the real latest commit
 * time from /api/py/now. Both degrade to a neutral placeholder (never an error)
 * when the backend or a key is absent.
 */
type ApiState = "checking" | "online" | "offline";

const stack = ["Next.js", "FastAPI", "Postgres", "LLMs"];

type Ago = { unit: "recent" | "justNow" | "minutes" | "hours" | "days"; n: number };

// Compact relative time, as a unit + number so each language can phrase it.
function relative(iso: string): Ago {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return { unit: "recent", n: 0 };
  const s = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (s < 60) return { unit: "justNow", n: 0 };
  if (s < 3600) return { unit: "minutes", n: Math.floor(s / 60) };
  if (s < 86400) return { unit: "hours", n: Math.floor(s / 3600) };
  return { unit: "days", n: Math.floor(s / 86400) };
}

export function LiveSignals() {
  const t = useTranslations("signals");
  const [api, setApi] = useState<ApiState>("checking");
  const [ago, setAgo] = useState<Ago>({ unit: "recent", n: 0 });

  useEffect(() => {
    let alive = true;
    const ctrl = new AbortController();
    const timeout = window.setTimeout(() => ctrl.abort(), 4000);
    fetch("/api/py/health", { signal: ctrl.signal })
      .then((r) => alive && setApi(r.ok ? "online" : "offline"))
      .catch(() => alive && setApi("offline"))
      .finally(() => window.clearTimeout(timeout));
    // Latest commit time from /now (best effort; keeps "recent" if absent).
    fetchNow()
      .then((d) => {
        if (alive && d?.activity.latestCommit) setAgo(relative(d.activity.latestCommit.pushedAt));
      })
      .catch(() => {});
    return () => {
      alive = false;
      ctrl.abort();
    };
  }, []);

  const dot =
    api === "online" ? "bg-ok" : api === "offline" ? "bg-muted" : "bg-warn animate-pulse";

  return (
    <div className="rounded-xl border border-line bg-card/50 p-3 text-xs">
      <p className="mb-2 font-mono uppercase tracking-[0.16em] text-muted">{t("title")}</p>
      <ul className="space-y-1.5 text-ink/80">
        <li className="flex items-center justify-between">
          <span className="text-muted">API</span>
          <span className="flex items-center gap-1.5">
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${dot}`} />
            {t(api)}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-muted">{t("assistant")}</span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-ok" /> {t("ready")}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-muted">{t("latestCommit")}</span>
          <span className="font-mono text-ink/70">{t(ago.unit, { n: ago.n })}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-muted">{t("lagos")}</span>
          <LiveClock className="font-mono tabular-nums text-ink/70" />
        </li>
      </ul>
      <div className="mt-3 flex flex-wrap gap-1">
        {stack.map((s) => (
          <span
            key={s}
            className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
