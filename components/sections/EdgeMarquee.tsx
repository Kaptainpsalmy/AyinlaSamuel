/**
 * Thin vertical strip of technical signals that loops upward forever, riding
 * the right edge of the persistent sidebar at lg+. Meaning over decoration: the
 * words are what Samuel builds, not filler. Decorative for a11y (aria-hidden),
 * and the global reduced-motion rule stops the animation.
 *
 * Uses the animate-marquee-y utility (added to globals.css).
 */
const signals = [
  "Backend",
  "AI",
  "RAG",
  "APIs",
  "Systems",
  "FastAPI",
  "Agents",
  "Idempotency",
  "Streaming",
];

export function EdgeMarquee() {
  // Repeat enough that one half always exceeds the viewport for a gapless loop.
  const half = [...signals, ...signals, ...signals];
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 left-72 z-20 hidden w-8 select-none overflow-hidden border-l border-line/60 lg:block"
    >
      <div className="animate-marquee-y flex flex-col items-center">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex flex-col items-center">
            {half.map((s, i) => (
              <span key={`${copy}-${i}`} className="flex flex-col items-center py-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted [writing-mode:vertical-rl]">
                  {s}
                </span>
                <span className="mt-3 text-[11px] text-accent-2">/</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
