"use client";
import { useLocale } from "next-intl";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocale } from "@/i18n/actions";

/** EN / YO switch. Persists via a cookie (server action), then refreshes. */
export function LangToggle() {
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function pick(next: "en" | "yo") {
    if (next === locale) return;
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  }

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center rounded-full border border-line text-xs font-medium"
      data-pending={pending || undefined}
    >
      {(["en", "yo"] as const).map((code) => (
        <button
          key={code}
          onClick={() => pick(code)}
          aria-pressed={locale === code}
          className={
            "rounded-full px-3 py-1.5 uppercase transition-colors " +
            (locale === code ? "bg-ink text-canvas" : "text-muted hover:text-ink")
          }
        >
          {code === "yo" ? "YO" : "EN"}
        </button>
      ))}
    </div>
  );
}
