"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { Search, X } from "lucide-react";

const types = [
  { value: "", label: "All" },
  { value: "client", label: "Client" },
  { value: "side", label: "Side" },
  { value: "final-year", label: "Final year" },
  { value: "personal", label: "Personal" },
];

export function ProjectFilters({ stacks }: { stacks: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const type = params.get("type") ?? "";
  const stack = params.get("stack") ?? "";
  const q = params.get("q") ?? "";
  const sort = params.get("sort") ?? "featured";

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router]
  );

  const hasFilters = type || stack || q || sort !== "featured";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* search */}
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            defaultValue={q}
            onChange={(e) => setParam("q", e.target.value)}
            placeholder="Search projects..."
            aria-label="Search projects"
            className="w-full rounded-full border border-line bg-card py-2.5 pl-9 pr-4 text-sm text-ink outline-none placeholder:text-muted focus:border-accent"
          />
        </div>
        {/* sort */}
        <select
          value={sort}
          onChange={(e) => setParam("sort", e.target.value)}
          aria-label="Sort projects"
          className="rounded-full border border-line bg-card px-4 py-2.5 text-sm text-ink outline-none focus:border-accent"
        >
          <option value="featured">Featured first</option>
          <option value="newest">Newest first</option>
          <option value="az">A to Z</option>
        </select>
        {hasFilters && (
          <button
            onClick={() => router.replace(pathname, { scroll: false })}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-2.5 text-sm text-muted hover:text-ink"
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* type chips */}
      <div className="flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t.value}
            onClick={() => setParam("type", t.value)}
            aria-pressed={type === t.value}
            className={
              "rounded-full border px-3 py-1.5 text-sm transition-colors " +
              (type === t.value ? "border-accent bg-accent text-white" : "border-line text-muted hover:text-ink")
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* stack chips */}
      <div className="flex flex-wrap gap-1.5">
        {stacks.map((s) => (
          <button
            key={s}
            onClick={() => setParam("stack", stack === s ? "" : s)}
            aria-pressed={stack === s}
            className={
              "rounded-full border px-2.5 py-1 text-xs transition-colors " +
              (stack === s ? "border-accent text-accent-2" : "border-line text-muted hover:text-ink")
            }
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
