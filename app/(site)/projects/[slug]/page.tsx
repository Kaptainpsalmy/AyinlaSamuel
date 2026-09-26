import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";
import { GithubIcon as Github } from "@/components/common/BrandIcons";
import { projects } from "@/.velite";
import { Badge } from "@/components/ui/Badge";
import { Gallery } from "@/components/projects/Gallery";
import { EvidenceBlock } from "@/components/projects/EvidenceBlock";
import { PrevNext } from "@/components/projects/PrevNext";
import { ShareButton } from "@/components/common/ShareButton";
import { ViewCounter } from "@/components/projects/ViewCounter";
import { ProjectDiagram } from "@/components/projects/ProjectDiagram";
import { MDXContent } from "@/components/common/MDXContent";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/common/JsonLd";
import { pageMeta, projectLd, breadcrumbLd } from "@/lib/seo";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  // ogImage: null -> this route's own opengraph-image.tsx supplies the card.
  return pageMeta({ title: p.title, description: p.tagline, path: p.url, type: "article", ogImage: null });
}

// ordered list for prev/next (featured first, then order)
const ordered = [...projects].sort((a, b) =>
  a.featured !== b.featured ? (a.featured ? -1 : 1) : a.order - b.order
);

// project `type` value -> message key
const typeKey: Record<string, string> = {
  client: "client", side: "side", "final-year": "finalYear", personal: "personal",
};

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  const t = await getTranslations("project");
  const tt = await getTranslations("projectType");

  const idx = ordered.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? ordered[idx - 1] : null;
  const next = idx < ordered.length - 1 ? ordered[idx + 1] : null;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <JsonLd
        data={[
          projectLd(project),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
            { name: project.title, path: project.url },
          ]),
        ]}
      />
      <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeft size={16} /> {t("back")}
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
          <span className="text-accent-2">{typeKey[project.type] ? tt(typeKey[project.type]) : project.type}</span>
          <span>&middot;</span><span>{project.year}</span>
          <span>&middot;</span><span>{project.role}</span>
          {project.duration && (<><span>&middot;</span><span>{project.duration}</span></>)}
        </div>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{project.title}</h1>
        <p className="mt-3 text-lg text-muted">{project.tagline}</p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {project.links.live && (
            <a href={project.links.live} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm text-canvas hover:opacity-90">
              <ExternalLink size={15} /> {t("liveSite")}
            </a>
          )}
          {project.links.repo && (
            <a href={project.links.repo} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm hover:border-accent">
              <Github size={15} /> {t("code")}
            </a>
          )}
          {project.links.docs && (
            <a href={project.links.docs} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm hover:border-accent">
              <FileText size={15} /> {t("docs")}
            </a>
          )}
          <ShareButton title={project.title} />
          <div className="ml-auto"><ViewCounter slug={project.slug} /></div>
        </div>
      </header>

      {/* Gallery is not wrapped in a reveal: its first image is the morph target
          from the project card, so it must be visible when the page lands. */}
      {project.screenshots?.length > 0 && (
        <div className="mt-10">
          <Gallery images={project.screenshots} title={project.title} slug={project.slug} />
        </div>
      )}

      {/* Architecture diagram, only where it genuinely fits the system */}
      <Reveal>
        <ProjectDiagram slug={project.slug} />
      </Reveal>

      {/* Case-study body stays English (decided scope). */}
      <div className="prose-mdx mt-10 space-y-4 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_p]:leading-relaxed [&_p]:text-muted [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 [&_li]:text-muted [&_strong]:text-ink [&_a]:text-accent-2 [&_a]:underline">
        <MDXContent code={project.body} />
      </div>

      {project.evidence && (
        <Reveal className="mt-10">
          <EvidenceBlock evidence={project.evidence} live={project.links.live} />
        </Reveal>
      )}

      <Reveal className="mt-10 border-t border-line pt-8">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted">{t("techStack")}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.stack.map((s) => <Badge key={s}>{s}</Badge>)}
        </div>
      </Reveal>

      <PrevNext
        prev={prev ? { url: prev.url, title: prev.title } : null}
        next={next ? { url: next.url, title: next.title } : null}
      />
    </article>
  );
}
