import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Nav = { url: string; title: string } | null;

export function PrevNext({ prev, next }: { prev: Nav; next: Nav }) {
  return (
    <nav className="mt-16 grid gap-3 border-t border-line pt-8 sm:grid-cols-2" aria-label="Project navigation">
      {prev ? (
        <Link href={prev.url} className="group flex items-center gap-3 rounded-xl border border-line p-4 hover:border-accent/50">
          <ArrowLeft size={18} className="text-muted" />
          <span>
            <span className="block font-mono text-xs uppercase tracking-widest text-muted">Previous</span>
            <span className="block font-medium">{prev.title}</span>
          </span>
        </Link>
      ) : <span />}
      {next ? (
        <Link href={next.url} className="group flex items-center justify-end gap-3 rounded-xl border border-line p-4 text-right hover:border-accent/50">
          <span>
            <span className="block font-mono text-xs uppercase tracking-widest text-muted">Next</span>
            <span className="block font-medium">{next.title}</span>
          </span>
          <ArrowRight size={18} className="text-muted" />
        </Link>
      ) : <span />}
    </nav>
  );
}
