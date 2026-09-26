"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useActive } from "@/components/motion/useActive";

type Item = { slug: string; url: string; title: string; tagline: string; screenshots: string[] };

const ADVANCE_MS = 5000;
const SWIPE_PX = 40; // horizontal travel that counts as a swipe, not a tap

/**
 * Featured projects carousel. Auto-advances only while on screen and not
 * hovered/focused; swipe (touch or mouse drag) and arrow keys move it by hand.
 * Slides crossfade; reduced motion turns off auto-advance and the fade.
 */
export function FeaturedReel({ items }: { items: Item[] }) {
  const t = useTranslations("reel");
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const active = useActive(ref);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const swipe = useRef<{ x: number; moved: boolean } | null>(null);

  useEffect(() => {
    if (reduce || paused || !active || items.length < 2) return;
    const timer = setInterval(() => setI((x) => (x + 1) % items.length), ADVANCE_MS);
    return () => clearInterval(timer);
  }, [reduce, paused, active, items.length]);

  if (!items.length) return null;
  const item = items[i];
  const go = (d: number) => setI((x) => (x + d + items.length) % items.length);

  return (
    <div
      ref={ref}
      className="relative"
      role="region"
      aria-roledescription={t("carousel")}
      aria-label={t("label")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
        if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
      }}
    >
      <Link
        key={item.slug}
        href={item.url}
        draggable={false}
        aria-roledescription={t("slide")}
        aria-label={t("slideLabel", { n: i + 1, total: items.length, title: item.title })}
        className="group block animate-fade-in overflow-hidden rounded-[22px] border border-line bg-card touch-pan-y select-none"
        onPointerDown={(e) => { swipe.current = { x: e.clientX, moved: false }; }}
        onPointerMove={(e) => {
          if (swipe.current && Math.abs(e.clientX - swipe.current.x) > SWIPE_PX) swipe.current.moved = true;
        }}
        onPointerUp={(e) => {
          const s = swipe.current;
          if (s?.moved) go(e.clientX < s.x ? 1 : -1);
        }}
        onClick={(e) => {
          // A swipe should change the slide, not open the project.
          if (swipe.current?.moved) e.preventDefault();
          swipe.current = null;
        }}
      >
        <div className="relative aspect-[16/9] bg-canvas">
          {item.screenshots?.[0] && (
            <Image src={item.screenshots[0]} alt={item.title} fill sizes="100vw" loading={i === 0 ? "eager" : undefined} draggable={false} className="object-cover object-top" />
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-white/70">{t("featured")}</p>
            <h3 className="mt-1 text-2xl font-bold text-white">{item.title}</h3>
            <p className="mt-1 max-w-lg text-sm text-white/80">{item.tagline}</p>
          </div>
        </div>
      </Link>

      {items.length > 1 && (
        <>
          <button onClick={() => go(-1)} aria-label={t("previous")} className="absolute left-3 top-[calc(50%-1.25rem)] -translate-y-1/2 rounded-full border border-line bg-canvas/80 p-2 backdrop-blur hover:bg-canvas"><ChevronLeft size={18} /></button>
          <button onClick={() => go(1)} aria-label={t("next")} className="absolute right-3 top-[calc(50%-1.25rem)] -translate-y-1/2 rounded-full border border-line bg-canvas/80 p-2 backdrop-blur hover:bg-canvas"><ChevronRight size={18} /></button>
          {/* 6px pills inside 24px buttons: a comfortable tap target on phones.
              The margins keep the row where the bare pills sat. */}
          <div className="-mb-[9px] mt-[7px] flex justify-center">
            {items.map((_, j) => (
              <button key={j} onClick={() => setI(j)} aria-label={t("goTo", { n: j + 1 })} aria-pressed={j === i}
                className="grid h-6 min-w-6 place-items-center">
                <span className={"h-1.5 rounded-full transition-all " + (j === i ? "w-6 bg-accent" : "w-1.5 bg-line")} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
