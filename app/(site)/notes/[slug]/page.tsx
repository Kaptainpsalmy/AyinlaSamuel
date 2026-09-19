import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { notes } from "@/.velite";
import { Badge } from "@/components/ui/Badge";
import { MDXContent } from "@/components/common/MDXContent";
import { Pre } from "@/components/notes/Pre";
import { TOC } from "@/components/notes/TOC";
import { ShareButton } from "@/components/common/ShareButton";

export function generateStaticParams() {
  return notes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = notes.find((x) => x.slug === slug);
  if (!n) return {};
  return { title: n.title, description: n.excerpt };
}

const ordered = [...notes].sort((a, b) => b.date.localeCompare(a.date));

export default async function NoteDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = notes.find((n) => n.slug === slug);
  if (!note) notFound();

  const idx = ordered.findIndex((n) => n.slug === slug);
  const prev = idx > 0 ? ordered[idx - 1] : null;
  const next = idx < ordered.length - 1 ? ordered[idx + 1] : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-12">
        <article className="max-w-3xl">
          <Link href="/notes" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
            <ArrowLeft size={16} /> Back to notes
          </Link>

          <header className="mt-6">
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
              <span>{new Date(note.date).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}</span>
              <span className="inline-flex items-center gap-1"><Clock size={12} /> {note.metadata.readingTime} min read</span>
            </div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">{note.title}</h1>
            <p className="mt-3 text-lg text-muted">{note.excerpt}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {note.tags.map((t) => <Badge key={t}>{t}</Badge>)}
              <div className="ml-auto"><ShareButton title={note.title} /></div>
            </div>
          </header>

          <div className="prose-mdx mt-10 space-y-4 [&_h2]:mt-8 [&_h2]:scroll-mt-24 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:scroll-mt-24 [&_h3]:text-xl [&_h3]:font-semibold [&_p]:leading-relaxed [&_p]:text-muted [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 [&_li]:text-muted [&_strong]:text-ink [&_a]:text-accent-2 [&_a]:underline [&_code]:rounded [&_code]:bg-card [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm">
            <MDXContent code={note.body} components={{ pre: Pre }} />
          </div>

          <nav className="mt-16 grid gap-3 border-t border-line pt-8 sm:grid-cols-2" aria-label="Note navigation">
            {prev ? (
              <Link href={prev.url} className="flex items-center gap-3 rounded-xl border border-line p-4 hover:border-accent/50">
                <ArrowLeft size={18} className="text-muted" />
                <span><span className="block font-mono text-xs uppercase tracking-widest text-muted">Previous</span><span className="block font-medium">{prev.title}</span></span>
              </Link>
            ) : <span />}
            {next ? (
              <Link href={next.url} className="flex items-center justify-end gap-3 rounded-xl border border-line p-4 text-right hover:border-accent/50">
                <span><span className="block font-mono text-xs uppercase tracking-widest text-muted">Next</span><span className="block font-medium">{next.title}</span></span>
                <ArrowRight size={18} className="text-muted" />
              </Link>
            ) : <span />}
          </nav>
        </article>

        <aside className="sticky top-24 hidden h-fit lg:block">
          <TOC />
        </aside>
      </div>
    </div>
  );
}
