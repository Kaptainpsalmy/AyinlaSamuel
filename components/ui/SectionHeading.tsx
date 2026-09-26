import { cn } from "@/lib/cn";

/**
 * Consistent section heading with an optional mono kicker above it, matching
 * the styleguide vocabulary. `id` makes it a scroll/anchor target.
 */
export function SectionHeading({
  kicker,
  children,
  id,
  className,
}: {
  kicker?: string;
  children: React.ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <div id={id} className={cn("scroll-mt-[calc(var(--header-h)+2rem)]", className)}>
      {kicker && (
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-2">{kicker}</p>
      )}
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-pretty sm:text-3xl">
        {children}
      </h2>
    </div>
  );
}
