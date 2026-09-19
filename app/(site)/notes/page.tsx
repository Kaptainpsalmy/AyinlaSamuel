import Link from "next/link";
import { notes } from "@/.velite";
import { Badge } from "@/components/ui/Badge";
import { NoteFilters } from "@/components/notes/NoteFilters";
import { Clock } from "lucide-react";

export const metadata = { title: "Notes", description: "Engineering reflections and case-study writing." };

type SP = { [key: string]: string | string[] | undefined };

export default async function NotesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const tag = typeof sp.tag === "string" ? sp.tag : "";
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags))).sort();

  const list = [...notes]
    .filter((n) => !tag || n.tags.includes(tag))
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header className="mb-8">
        <h1 className="text-5xl font-bold tracking-tight">Notes</h1>
        <p className="mt-3 text-muted">Engineering reflections, grounded in real projects.</p>
      </header>

      <NoteFilters tags={allTags} />

      <div className="mt-8 space-y-4">
        {list.map((n) => (
          <Link key={n.slug} href={n.url} className="block rounded-xl border border-line p-6 transition-colors hover:border-accent/50">
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
              <span>{new Date(n.date).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" })}</span>
              <span className="inline-flex items-center gap-1"><Clock size={12} /> {n.metadata.readingTime} min</span>
            </div>
            <h2 className="mt-2 text-xl font-semibold">{n.title}</h2>
            <p className="mt-2 text-muted">{n.excerpt}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {n.tags.map((t) => <Badge key={t} className="text-[11px]">{t}</Badge>)}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
