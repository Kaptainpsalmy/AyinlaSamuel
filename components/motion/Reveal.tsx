"use client";
import { motion, useReducedMotion } from "motion/react";
import { distance, duration, ease, instant, viewport } from "@/lib/motion-config";

/**
 * Fades content up as it scrolls into view, once. The rendered element is the
 * same with or without reduced motion (only the timing changes), so server and
 * client markup always match. `data-reveal` lets the no-JS fallback force the
 * final state (see the <noscript> rule in the root layout).
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y: distance.reveal }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={reduce ? instant : { duration: duration.reveal, delay, ease: ease.out }}
    >
      {children}
    </motion.div>
  );
}
