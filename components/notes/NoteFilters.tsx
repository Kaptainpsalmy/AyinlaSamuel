"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export function NoteFilters({ tags }: { tags: string[] }) {
  const t = useTranslations("notes");
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const active = params.get("tag") ?? "";

  const pick = (tag: string) => {
    const next = new URLSearchParams(params.toString());
    if (tag && tag !== active) next.set("tag", tag);
    else next.delete("tag");
    router.replace(next.toString() ? `${pathname}?${next}` : pathname, { scroll: false });
  };

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={t("filterLabel")}>
      <button onClick={() => pick("")} aria-pressed={!active}
        className={"rounded-full border px-3 py-1.5 text-sm transition-colors " + (!active ? "border-accent bg-accent text-white" : "border-line text-muted hover:text-ink")}>
        {t("allTags")}
      </button>
      {tags.map((tg) => (
        <button key={tg} onClick={() => pick(tg)} aria-pressed={active === tg}
          className={"rounded-full border px-3 py-1.5 text-sm transition-colors " + (active === tg ? "border-accent bg-accent text-white" : "border-line text-muted hover:text-ink")}>
          {tg}
        </button>
      ))}
    </div>
  );
}
