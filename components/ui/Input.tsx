import { cn } from "@/lib/cn";

const base =
  "w-full rounded-xl border border-line bg-card px-4 py-2.5 text-sm text-ink " +
  "outline-none transition-colors placeholder:text-muted " +
  "focus:border-accent disabled:opacity-50 disabled:pointer-events-none";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(base, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(base, "min-h-28 resize-y", className)} {...props} />;
}
