"use client";
import Image from "next/image";
import { useEffect, useState, ViewTransition } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { coverTransitionName } from "@/lib/transitions";

/**
 * Screenshot grid with a lightbox. The first image shares a view-transition
 * name with the project card cover, so arriving from /projects morphs the card
 * into place.
 */
export function Gallery({ images, title, slug }: { images: string[]; title: string; slug: string }) {
  const t = useTranslations("gallery");
  const tc = useTranslations("common");
  const [open, setOpen] = useState<string | null>(null);

  // Escape closes the lightbox.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!images?.length) return null;
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        {images.map((src, i) => {
          const tile = (
            <button
              key={src}
              onClick={() => setOpen(src)}
              className="group relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-line bg-card"
              aria-label={t("enlarge", { n: i + 1 })}
            >
              <Image
                src={src}
                alt={t("alt", { title, n: i + 1 })}
                fill
                // The first screenshot is the page's largest paint: fetch it now, first.
                loading={i === 0 ? "eager" : undefined}
                fetchPriority={i === 0 ? "high" : undefined}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </button>
          );
          return i === 0 ? (
            <ViewTransition key={src} name={coverTransitionName(slug)} share="morph" default="none">
              {tile}
            </ViewTransition>
          ) : (
            tile
          );
        })}
      </div>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <button className="absolute right-5 top-5 text-white" aria-label={tc("close")}><X size={28} /></button>
          <div className="relative max-h-[90vh] w-full max-w-5xl">
            <Image src={open} alt={title} width={1600} height={1000} className="h-auto max-h-[90vh] w-full rounded-lg object-contain" />
          </div>
        </div>
      )}
    </>
  );
}
