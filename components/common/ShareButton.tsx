"use client";
import { Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "@/components/common/Toast";

export function ShareButton({ title }: { title: string }) {
  const t = useTranslations("share");
  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title, url }); return; } catch { /* cancelled */ }
    }
    try { await navigator.clipboard.writeText(url); toast(t("copied")); }
    catch { toast(t("failed")); }
  }
  return (
    <button
      onClick={share}
      className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:text-ink"
    >
      <Share2 size={15} /> {t("label")}
    </button>
  );
}
