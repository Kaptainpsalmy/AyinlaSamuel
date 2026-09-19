import * as Lucide from "lucide-react";

/** Resolve a lucide icon by name string (used for services). Falls back to a dot. */
export function Icon({ name, size = 22, className }: { name: string; size?: number; className?: string }) {
  const Cmp = (Lucide as unknown as Record<string, Lucide.LucideIcon>)[name] ?? Lucide.Circle;
  return <Cmp size={size} className={className} />;
}
