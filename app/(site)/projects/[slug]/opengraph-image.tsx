import { projects } from "@/.velite";
import { renderOg, ogSize, ogContentType } from "@/lib/og";

export const alt = "Project case study by Ayinla Samuel Olorunwa";
export const size = ogSize;
export const contentType = ogContentType;

// Prerender one card per project at build time.
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return renderOg({ kicker: "Project", title: "PsalmNova" });
  return renderOg({
    kicker: `Case study / ${p.domain} / ${p.year}`,
    title: p.title,
    subtitle: p.tagline,
    image: p.screenshots[0],
  });
}
