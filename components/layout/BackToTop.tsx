"use client";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";

export function BackToTop() {
  const t = useTranslations("common");
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={t("backToTop")}
      className="fixed bottom-40 right-6 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-card text-ink shadow-lg transition-colors hover:bg-canvas lg:bottom-24"
    >
      <ArrowUp size={18} />
    </button>
  );
}
