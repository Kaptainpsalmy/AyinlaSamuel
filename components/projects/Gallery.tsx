"use client";
import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState<string | null>(null);
  if (!images?.length) return null;
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setOpen(src)}
            className="group relative aspect-[16/10] overflow-hidden rounded-xl border border-line bg-card"
            aria-label={`Enlarge screenshot ${i + 1}`}
          >
            <Image
              src={src}
              alt={`${title} screenshot ${i + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
        >
          <button className="absolute right-5 top-5 text-white" aria-label="Close"><X size={28} /></button>
          <div className="relative max-h-[90vh] w-full max-w-5xl">
            <Image src={open} alt={title} width={1600} height={1000} className="h-auto max-h-[90vh] w-full rounded-lg object-contain" />
          </div>
        </div>
      )}
    </>
  );
}
