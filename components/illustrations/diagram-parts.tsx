/**
 * Shared building blocks for the engineering diagrams (RAG, payment, agent).
 * Everything themes automatically: node borders/labels use currentColor
 * (inherits text-ink), fills use the card token, and highlighted nodes/edges
 * use the accent token through a text-accent wrapper. Kept dependency-free so
 * the diagrams can render as server components.
 */
import type { ReactNode } from "react";

export function DiagramNode({
  x,
  y,
  w = 108,
  h = 40,
  label,
  sub,
  accent = false,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <g className={accent ? "text-accent" : undefined}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={6}
        fill="var(--color-card)"
        stroke="currentColor"
        strokeWidth={accent ? 2.5 : 2}
      />
      <text
        x={x + w / 2}
        y={sub ? y + h / 2 - 3 : y + h / 2 + 4}
        textAnchor="middle"
        fill="currentColor"
        className="font-sans"
        fontSize="12"
        fontWeight="600"
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 12}
          textAnchor="middle"
          fill="currentColor"
          fillOpacity="0.55"
          className="font-mono"
          fontSize="9"
        >
          {sub}
        </text>
      )}
    </g>
  );
}

export function DiagramArrow({
  x1,
  y1,
  x2,
  y2,
  accent = false,
  dashed = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  accent?: boolean;
  dashed?: boolean;
}) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = 6;
  const ax = x2 - head * Math.cos(angle);
  const ay = y2 - head * Math.sin(angle);
  return (
    <g
      className={accent ? "text-accent" : undefined}
      stroke="currentColor"
      strokeOpacity={accent ? 1 : 0.5}
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line
        x1={x1}
        y1={y1}
        x2={ax}
        y2={ay}
        strokeDasharray={dashed ? "3 5" : undefined}
      />
      <path
        d={`M${x2} ${y2}
            L${x2 - head * Math.cos(angle - 0.5)} ${y2 - head * Math.sin(angle - 0.5)}
            M${x2} ${y2}
            L${x2 - head * Math.cos(angle + 0.5)} ${y2 - head * Math.sin(angle + 0.5)}`}
        fill="none"
      />
    </g>
  );
}

export function DiagramFrame({
  viewBox,
  title,
  className,
  children,
}: {
  viewBox: string;
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg viewBox={viewBox} fill="none" role="img" aria-label={title} className={className}>
      <title>{title}</title>
      {children}
    </svg>
  );
}
