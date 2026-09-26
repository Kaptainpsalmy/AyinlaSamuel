import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Nav = { url: string; title: string } | null;

export async function PrevNext({ prev, next }: { prev: Nav; next: Nav }) {
  const t = await getTranslations("prevNext");
  return (
    <nav className="mt-16 grid gap-3 border-t border-line pt-8 sm:grid-cols-2" aria-label={t("label")}>
      {prev ? (
        <Link href={prev.url} className="group flex items-center gap-3 rounded-xl border border-line p-4 transition-colors hover:border-accent/50">
          <ArrowLeft size={18} className="text-muted transition-transform group-hover:-translate-x-0.5" />
          <span>
            <span className="block font-mono text-xs uppercase tracking-widest text-muted">{t("previous")}</span>
            <span className="block font-medium">{prev.title}</span>
          </span>
        </Link>
      ) : <span />}
      {next ? (
        <Link href={next.url} className="group flex items-center justify-end gap-3 rounded-xl border border-line p-4 text-right transition-colors hover:border-accent/50">
          <span>
            <span className="block font-mono text-xs uppercase tracking-widest text-muted">{t("next")}</span>
            <span className="block font-medium">{next.title}</span>
          </span>
          <ArrowRight size={18} className="text-muted transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : <span />}
    </nav>
  );
}
