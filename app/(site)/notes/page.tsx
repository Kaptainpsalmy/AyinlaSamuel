import type { Metadata } from "next";
import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { notes } from "@/.velite";
import { Badge } from "@/components/ui/Badge";
import { NoteFilters } from "@/components/notes/NoteFilters";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Clock } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("notes");
  return pageMeta({ title: t("title"), description: t("description"), path: "/notes" });
}

type SP = { [key: string]: string | string[] | undefined };

export default async function NotesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const t = await getTranslations("notes");
  const format = await getFormatter();
  const sp = await searchParams;
  const tag = typeof sp.tag === "string" ? sp.tag : "";
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags))).sort();

  const list = [...notes]
    .filter((n) => !tag || n.tags.includes(tag))
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header className="mb-8">
        <h1 className="text-5xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-3 text-muted">{t("lead")}</p>
      </header>

      <NoteFilters tags={allTags} />

      {/* Note titles, excerpts, and bodies stay English (decided scope). */}
      <Stagger className="mt-8 space-y-4">
        {list.map((n) => (
          <StaggerItem key={n.slug}>
            <Link href={n.url} className="block rounded-xl border border-line p-6 transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-accent/50">
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
                <span>{format.dateTime(new Date(n.date), { year: "numeric", month: "short", day: "numeric" })}</span>
                <span className="inline-flex items-center gap-1"><Clock size={12} /> {t("minutes", { count: n.metadata.readingTime })}</span>
              </div>
              <h2 className="mt-2 text-xl font-semibold">{n.title}</h2>
              <p className="mt-2 text-muted">{n.excerpt}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {n.tags.map((tg) => <Badge key={tg} className="text-[11px]">{tg}</Badge>)}
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
