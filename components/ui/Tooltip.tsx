import { cn } from "@/lib/cn";

/**
 * CSS-only tooltip: appears on hover and keyboard focus (group-focus-within),
 * so it is accessible without JS. Wrap any focusable trigger. Both themes via
 * tokens. Keep labels short; this is a hint, not a popover.
 */
export function Tooltip({
  label,
  children,
  side = "top",
  className,
}: {
  label: string;
  children: React.ReactNode;
  side?: "top" | "bottom";
  className?: string;
}) {
  const pos =
    side === "top"
      ? "bottom-full mb-2 left-1/2 -translate-x-1/2"
      : "top-full mt-2 left-1/2 -translate-x-1/2";
  return (
    <span className={cn("group relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 whitespace-nowrap rounded-lg border border-line " +
            "bg-canvas px-2 py-1 text-xs text-ink opacity-0 shadow-lg transition-opacity " +
            "group-hover:opacity-100 group-focus-within:opacity-100",
          pos,
        )}
      >
        {label}
      </span>
    </span>
  );
}
