"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Maximize2, Shuffle } from "lucide-react";

/**
 * The sidebar puzzle's frame (title row + expand link) and its start button.
 * Shared by TakeABreak and LazyTakeABreak so the placeholder shown before the
 * game loads is the same markup as the game's own first state.
 */
export function CompactFrame({ children }: { children: React.ReactNode }) {
  const t = useTranslations("game");
  return (
    <div className="rounded-xl border border-line bg-card/50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{t("title")}</p>
        <Link href="/play" aria-label={t("biggerLabel")} className="text-muted hover:text-accent-2">
          <Maximize2 size={13} />
        </Link>
      </div>
      {children}
    </div>
  );
}

export function QuickStartButton(props: React.ComponentProps<"button">) {
  const t = useTranslations("game");
  return (
    <button
      {...props}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-3 py-2 text-xs font-medium text-canvas hover:opacity-90"
    >
      <Shuffle size={13} /> {t("quickPuzzle")}
    </button>
  );
}
