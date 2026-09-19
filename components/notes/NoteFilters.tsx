"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function NoteFilters({ tags }: { tags: string[] }) {
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
    <div className="flex flex-wrap gap-2">
      <button onClick={() => pick("")} aria-pressed={!active}
        className={"rounded-full border px-3 py-1.5 text-sm transition-colors " + (!active ? "border-accent bg-accent text-white" : "border-line text-muted hover:text-ink")}>
        All
      </button>
      {tags.map((t) => (
        <button key={t} onClick={() => pick(t)} aria-pressed={active === t}
          className={"rounded-full border px-3 py-1.5 text-sm transition-colors " + (active === t ? "border-accent bg-accent text-white" : "border-line text-muted hover:text-ink")}>
          {t}
        </button>
      ))}
    </div>
  );
}
