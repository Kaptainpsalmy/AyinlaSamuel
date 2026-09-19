"use client";
import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { incrementView, fetchViews } from "@/lib/api-client";

export function ViewCounter({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const key = `viewed:${slug}`;
    let seen = false;
    try { seen = sessionStorage.getItem(key) === "1"; } catch {}
    if (seen) {
      fetchViews(slug).then(setViews);
    } else {
      try { sessionStorage.setItem(key, "1"); } catch {}
      incrementView(slug).then(setViews);
    }
  }, [slug]);

  if (views === null || views === 0) return null;
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted">
      <Eye size={13} /> {views.toLocaleString()} view{views === 1 ? "" : "s"}
    </span>
  );
}
