"use client";
import { useEffect, useState } from "react";
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
  const [data, setData] = useState<ContribData | null>(null);
  useEffect(() => { fetchContributions().then(setData); }, []);
  if (!data) return null;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h2 className="text-2xl font-bold">Contributions</h2>
        <span className="font-mono text-xs text-muted">
          {data.total.toLocaleString()} in the last year
          {data.source === "sample" && <span className="ml-1 text-warn">(sample)</span>}
        </span>
      </div>
      <div className="mt-4 overflow-x-auto">
        <div className="flex gap-1" style={{ minWidth: "fit-content" }}>
          {data.weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((count, di) => (
                <div
                  key={di}
                  className={"h-2.5 w-2.5 rounded-sm " + levelClass[level(count)]}
                  title={`${count} contribution${count === 1 ? "" : "s"}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5 font-mono text-[10px] text-muted">
        <span>Less</span>
        {levelClass.map((c, i) => <span key={i} className={"h-2.5 w-2.5 rounded-sm " + c} />)}
        <span>More</span>
      </div>
    </div>
  );
}
