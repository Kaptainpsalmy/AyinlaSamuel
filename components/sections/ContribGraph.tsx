"use client";
import { startTransition, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { fetchContributions, type ContribData } from "@/lib/api-client";

// accent-scaled cells: 5 levels from faint to full accent
const levelClass = ["bg-line", "bg-accent/25", "bg-accent/50", "bg-accent/75", "bg-accent"];
function level(count: number): number {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 5) return 3;
  return 4;
}

export function ContribGraph() {
  const t = useTranslations("contrib");
  const [data, setData] = useState<ContribData | null>(null);
  // ~370 cells: render them as a transition so React can yield between cells
  // instead of blocking the main thread in one long task.
  useEffect(() => { fetchContributions().then((d) => startTransition(() => setData(d))); }, []);
  // Tooltips repeat the same few counts: format each distinct count once.
  const cellTitle = useMemo(() => {
    const seen = new Map<number, string>();
    return (count: number) => {
      let s = seen.get(count);
      if (s === undefined) seen.set(count, (s = t("cell", { count })));
      return s;
    };
  }, [t]);
  if (!data) return null;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <span className="font-mono text-xs text-muted">
          {t("total", { count: data.total })}
          {data.source === "sample" && <span className="ml-1 text-warn-ink">({t("sample")})</span>}
        </span>
      </div>
      <div className="mt-4 overflow-x-auto">
        <div className="flex gap-1" style={{ minWidth: "fit-content" }} role="img" aria-label={t("total", { count: data.total })}>
          {data.weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((count, di) => (
                <div
                  key={di}
                  className={"h-2.5 w-2.5 rounded-sm " + levelClass[level(count)]}
                  title={cellTitle(count)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5 font-mono text-[10px] text-muted" aria-hidden="true">
        <span>{t("less")}</span>
        {levelClass.map((c, i) => <span key={i} className={"h-2.5 w-2.5 rounded-sm " + c} />)}
        <span>{t("more")}</span>
      </div>
    </div>
  );
}
