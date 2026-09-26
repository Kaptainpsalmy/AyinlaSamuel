import { cn } from "@/lib/cn";

/** A keyboard-key hint, e.g. <Kbd>⌘</Kbd><Kbd>K</Kbd>. */
export function Kbd({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded border border-line " +
          "bg-card px-1.5 font-mono text-[11px] text-muted",
        className,
      )}
      {...props}
    />
  );
}
