import { cn } from "@/lib/cn";

export function Card({
  feature = false,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { feature?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-[22px] p-8 transition-colors",
        feature
          ? "bg-feature text-feature-ink"
          : "bg-card text-ink border border-line",
        className
      )}
      {...props}
    />
  );
}
