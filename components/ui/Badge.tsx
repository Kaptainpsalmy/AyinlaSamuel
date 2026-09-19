import { cn } from "@/lib/cn";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-line px-3 py-1 text-xs font-medium text-muted",
        className
      )}
      {...props}
    />
  );
}
