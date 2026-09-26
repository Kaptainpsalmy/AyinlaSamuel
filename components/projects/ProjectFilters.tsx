"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { Search, X } from "lucide-react";

// Values are URL params (stay English); labels come from the messages.
const types = [
  { value: "", key: "all" },
  { value: "client", key: "client" },
  { value: "side", key: "side" },
  { value: "final-year", key: "finalYear" },
  { value: "personal", key: "personal" },
] as const;

// Primary axis: how a hiring manager scans. Maps to each project's `domain`.
const domains = [
  { value: "", key: "all" },
  { value: "systems", key: "systems" },
  { value: "intelligence", key: "intelligence" },
  { value: "commerce", key: "commerce" },
  { value: "product", key: "product" },
] as const;

export function ProjectFilters({ stacks }: { stacks: string[] }) {
  const t = useTranslations("filters");
  const tt = useTranslations("projectType");
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const domain = params.get("domain") ?? "";
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

  const hasFilters = domain || type || stack || q || sort !== "featured";

  return (
    <div className="space-y-4">
      {/* primary axis: engineering domain */}
      <div className="flex flex-wrap gap-2" role="group" aria-label={t("byDomain")}>
        {domains.map((d) => (
          <button
            key={d.value}
            onClick={() => setParam("domain", d.value)}
            aria-pressed={domain === d.value}
            title={d.key === "all" ? undefined : t(`domainHint.${d.key}`)}
            className={
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors " +
              (domain === d.value
                ? "border-accent bg-accent text-white"
                : "border-line text-muted hover:text-ink")
            }
          >
            {t(`domain.${d.key}`)}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* search */}
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            defaultValue={q}
            onChange={(e) => setParam("q", e.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchLabel")}
            className="w-full rounded-full border border-line bg-card py-2.5 pl-9 pr-4 text-sm text-ink outline-none placeholder:text-muted focus:border-accent"
          />
        </div>
        {/* sort */}
        <select
          value={sort}
          onChange={(e) => setParam("sort", e.target.value)}
          aria-label={t("sortLabel")}
          className="rounded-full border border-line bg-card px-4 py-2.5 text-sm text-ink outline-none focus:border-accent"
        >
          <option value="featured">{t("sortFeatured")}</option>
          <option value="newest">{t("sortNewest")}</option>
          <option value="az">{t("sortAz")}</option>
        </select>
        {hasFilters && (
          <button
            onClick={() => router.replace(pathname, { scroll: false })}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-2.5 text-sm text-muted hover:text-ink"
          >
            <X size={14} /> {t("clear")}
          </button>
        )}
      </div>

      {/* type chips */}
      <div className="flex flex-wrap gap-2" role="group" aria-label={t("byType")}>
        {types.map((ty) => (
          <button
            key={ty.value}
            onClick={() => setParam("type", ty.value)}
            aria-pressed={type === ty.value}
            className={
              "rounded-full border px-3 py-1.5 text-sm transition-colors " +
              (type === ty.value ? "border-accent bg-accent text-white" : "border-line text-muted hover:text-ink")
            }
          >
            {tt(ty.key)}
          </button>
        ))}
      </div>

      {/* stack chips (technology names stay as written) */}
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={t("byStack")}>
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
