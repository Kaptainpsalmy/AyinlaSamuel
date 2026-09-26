"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Inlines a themed illustration SVG so its `currentColor` and `var(--color-*)`
 * resolve against the live theme. An <img> tag cannot read the page's CSS
 * variables, so these must be inlined into the DOM. The files are our own
 * vetted static assets under public/illustrations/themed, produced by
 * scripts/recolor-illustrations.mjs, so inlining their markup is safe.
 *
 * Fetched on the client when the box nears the viewport instead of rendered on
 * the server. Server-inlined, each SVG shipped twice (once as HTML, once again
 * in the React payload), and the 404 art rode along on every page because Next
 * includes the not-found boundary in each page's payload. Fetched, the file is
 * downloaded once and cached by the browser. Every caller gives the box a fixed
 * size, so nothing shifts when the art arrives. The art is decorative, so
 * visitors without JavaScript simply do not see it.
 */

const cache = new Map<string, Promise<string | null>>();

function loadSvg(name: string): Promise<string | null> {
  let p = cache.get(name);
  if (!p) {
    p = fetch(`/illustrations/themed/${name}.svg`)
      .then((r) => (r.ok ? r.text() : null))
      // Make the inlined <svg> scale to its box.
      .then((svg) => svg && svg.replace(/<svg\b/, `<svg preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block"`))
      .catch(() => null);
    cache.set(name, p);
  }
  return p;
}

export function ThemedIllustration({
  name,
  className,
  label,
}: {
  /** file stem under public/illustrations/themed (e.g. "hero", "connect") */
  name: string;
  className?: string;
  /** accessible label; omit for decorative (renders aria-hidden) */
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        loadSvg(name).then((s) => !cancelled && setSvg(s));
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [name]);

  return (
    <div
      ref={ref}
      className={(className ? className + " " : "") + "transition-opacity duration-500 " + (svg ? "opacity-100" : "opacity-0")}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      // Vetted, self-generated static SVG (see note above).
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  );
}
