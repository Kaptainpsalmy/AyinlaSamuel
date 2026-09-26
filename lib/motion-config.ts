/**
 * Shared motion vocabulary. Every animation on the site reads its timing from
 * here so the whole thing feels like one system instead of scattered effects.
 *
 *   micro     hover, press, color          120-200ms
 *   reveal    content entering on scroll   500ms
 *   page      route change enter/exit      exit 150ms, enter 350ms
 *
 * Only transform and opacity are animated (no layout properties), so motion
 * never causes layout shift. Reduced motion collapses every duration to 0.
 */

export const ease = {
  /** Fast start, soft landing. The default for anything entering. */
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
};

export const duration = {
  micro: 0.15,
  reveal: 0.5,
  stagger: 0.45,
} as const;

/** Distance (px) content travels while revealing. Small on purpose. */
export const distance = {
  reveal: 16,
  staggerItem: 14,
} as const;

/** Gap between items in a staggered group (seconds). */
export const staggerGap = 0.07;

/** Trigger reveals slightly before the element is fully on screen. */
export const viewport = { once: true, margin: "-80px" } as const;

/** Instant transition used when the visitor prefers reduced motion. */
export const instant = { duration: 0 } as const;
