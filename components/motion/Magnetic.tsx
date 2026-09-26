"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

/**
 * Magnetic wrapper: the child drifts a few pixels toward the cursor while
 * hovered, then springs back on leave. Touch devices never fire mousemove, so
 * it is a no-op there. Under reduced motion the element stays put. The same
 * element renders either way, so server and client markup always match.
 */
export function Magnetic({
  children,
  strength = 0.3,
  className,
}: {
  children: React.ReactNode;
  /** 0..1 fraction of the cursor offset the element follows */
  strength?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 250, damping: 20, mass: 0.4 });

  return (
    <motion.div
      ref={ref}
      className={["inline-block", className].filter(Boolean).join(" ")}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el || reduce) return;
        const r = el.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
