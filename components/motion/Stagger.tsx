"use client";
import { motion, useReducedMotion } from "motion/react";
import { distance, duration, ease, instant, staggerGap, viewport } from "@/lib/motion-config";

/**
 * Reveals its StaggerItem children one after another as the group scrolls into
 * view. Same markup with or without reduced motion; only the timing collapses.
 */
export function Stagger({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={{ show: { transition: reduce ? instant : { staggerChildren: staggerGap } } }}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      data-reveal=""
      className={className}
      variants={{
        hidden: { opacity: 0, y: distance.staggerItem },
        show: { opacity: 1, y: 0 },
      }}
      transition={reduce ? instant : { duration: duration.stagger, ease: ease.out }}
    >
      {children}
    </Tag>
  );
}
