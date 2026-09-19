/** Typed fetchers for the FastAPI backend. All tolerate failure and degrade. */

export type NowData = {
  activity: { latestCommit: { repo: string; repoShort: string; message: string; pushedAt: string; url: string } | null };
  role: string;
  lagosTime: string;
  building: string;
};

export type ContribData = { source: "live" | "sample"; total: number; weeks: number[][] };

export async function fetchNow(): Promise<NowData | null> {
  try {
    const r = await fetch("/api/py/now", { cache: "no-store" });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

export async function fetchContributions(): Promise<ContribData | null> {
  try {
    const r = await fetch("/api/py/github/contributions");
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

export async function fetchViews(slug: string): Promise<number> {
  try {
    const r = await fetch(`/api/py/projects/${slug}/views`);
    if (!r.ok) return 0;
    return (await r.json()).views ?? 0;
  } catch { return 0; }
}

export async function incrementView(slug: string): Promise<number> {
  try {
    const r = await fetch(`/api/py/projects/${slug}/views`, { method: "POST" });
    if (!r.ok) return 0;
    return (await r.json()).views ?? 0;
  } catch { return 0; }
}
