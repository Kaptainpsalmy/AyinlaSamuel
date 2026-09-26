import { notes } from "@/.velite";
import { renderOg, ogSize, ogContentType } from "@/lib/og";

export const alt = "Engineering note by Ayinla Samuel Olorunwa";
export const size = ogSize;
export const contentType = ogContentType;

// Prerender one card per note at build time.
export function generateStaticParams() {
  return notes.map((n) => ({ slug: n.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = notes.find((x) => x.slug === slug);
  if (!n) return renderOg({ kicker: "Note", title: "PsalmNova" });
  return renderOg({
    kicker: `Note / ${n.metadata.readingTime} min read`,
    title: n.title,
    subtitle: n.excerpt,
  });
}
