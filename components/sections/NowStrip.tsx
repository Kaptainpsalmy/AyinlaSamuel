"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { GitCommit } from "lucide-react";
import { fetchNow, type NowData } from "@/lib/api-client";

type Ago = { unit: "justNow" | "minutes" | "hours" | "days"; n: number };

// Relative time as a unit + number so each language can phrase it.
function relTime(iso: string): Ago {
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 60) return { unit: "justNow", n: 0 };
  if (d < 3600) return { unit: "minutes", n: Math.floor(d / 60) };
  if (d < 86400) return { unit: "hours", n: Math.floor(d / 3600) };
  return { unit: "days", n: Math.floor(d / 86400) };
}

export function NowStrip() {
  const t = useTranslations("now");
  const ts = useTranslations("signals");
  const [now, setNow] = useState<NowData | null>(null);
  const [clock, setClock] = useState<string>("");

  useEffect(() => {
    let active = true;
    const load = async () => { const d = await fetchNow(); if (active) setNow(d); };
    load();
    const poll = setInterval(load, 60000);
    return () => { active = false; clearInterval(poll); };
  }, []);

  // live Lagos clock, ticking every second
  useEffect(() => {
    const tick = () => {
      setClock(new Date().toLocaleTimeString("en-GB", { timeZone: "Africa/Lagos", hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  if (!now) return null;
  const commit = now.activity.latestCommit;
  const ago = commit ? relTime(commit.pushedAt) : null;

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-full border border-line bg-card/50 px-4 py-2.5 font-mono text-xs text-muted">
      {/* The role string comes from the API and stays as the API reports it. */}
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-ok" />
        {now.role}
      </span>
      <span className="hidden sm:inline" suppressHydrationWarning>{clock} WAT</span>
      {commit && ago ? (
        <a href={commit.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-ink">
          <GitCommit size={13} />
          <span className="max-w-[220px] truncate">{commit.repoShort}: {commit.message}</span>
          <span className="text-accent-2">{ts(ago.unit, { n: ago.n })}</span>
        </a>
      ) : (
        <span className="hidden md:inline">{t("building", { what: now.building })}</span>
      )}
    </div>
  );
}
