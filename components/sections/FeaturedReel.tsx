"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Item = { slug: string; url: string; title: string; tagline: string; screenshots: string[] };

export function FeaturedReel({ items }: { items: Item[] }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (reduce || paused || items.length < 2) return;
    timer.current = setInterval(() => setI((x) => (x + 1) % items.length), 5000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [reduce, paused, items.length]);

  if (!items.length) return null;
  const item = items[i];
  const go = (d: number) => setI((x) => (x + d + items.length) % items.length);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <Link href={item.url} className="group block overflow-hidden rounded-[22px] border border-line bg-card">
        <div className="relative aspect-[16/9] bg-canvas">
          {item.screenshots?.[0] && (
            <Image src={item.screenshots[0]} alt={item.title} fill sizes="100vw" priority className="object-cover object-top" />
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-white/70">Featured</p>
            <h3 className="mt-1 text-2xl font-bold text-white">{item.title}</h3>
            <p className="mt-1 max-w-lg text-sm text-white/80">{item.tagline}</p>
          </div>
        </div>
      </Link>

      {items.length > 1 && (
        <>
          <button onClick={() => go(-1)} aria-label="Previous" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-line bg-canvas/80 p-2 backdrop-blur hover:bg-canvas"><ChevronLeft size={18} /></button>
          <button onClick={() => go(1)} aria-label="Next" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-line bg-canvas/80 p-2 backdrop-blur hover:bg-canvas"><ChevronRight size={18} /></button>
          <div className="mt-4 flex justify-center gap-1.5">
            {items.map((_, j) => (
              <button key={j} onClick={() => setI(j)} aria-label={`Go to slide ${j + 1}`} aria-pressed={j === i}
                className={"h-1.5 rounded-full transition-all " + (j === i ? "w-6 bg-accent" : "w-1.5 bg-line")} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
