"use client";
import { useEffect, useState } from "react";
import { GitCommit } from "lucide-react";
import { fetchNow, type NowData } from "@/lib/api-client";

function relTime(iso: string): string {
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 60) return "just now";
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

export function NowStrip() {
  const [now, setNow] = useState<NowData | null>(null);
  const [clock, setClock] = useState<string>("");

  useEffect(() => {
    let active = true;
    const load = async () => { const d = await fetchNow(); if (active) setNow(d); };
    load();
    const poll = setInterval(load, 60000);
    return () => { active = false; clearInterval(poll); };
  }, []);

  // live Lagos clock, ticking every second off the server-provided base
  useEffect(() => {
    const tick = () => {
      const t = new Date().toLocaleTimeString("en-GB", { timeZone: "Africa/Lagos", hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setClock(t);
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  if (!now) return null;
  const commit = now.activity.latestCommit;

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-full border border-line bg-card/50 px-4 py-2.5 font-mono text-xs text-muted">
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-ok" />
        {now.role}
      </span>
      <span className="hidden sm:inline">{clock} WAT</span>
      {commit ? (
        <a href={commit.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-ink">
          <GitCommit size={13} />
          <span className="max-w-[220px] truncate">{commit.repoShort}: {commit.message}</span>
          <span className="text-accent-2">{relTime(commit.pushedAt)}</span>
        </a>
      ) : (
        <span className="hidden md:inline">building {now.building}</span>
      )}
    </div>
  );
}
