import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/Badge";
import { coverTransitionName } from "@/lib/transitions";

type Project = {
  slug: string;
  url: string;
  title: string;
  tagline: string;
  type: string;
  stack: string[];
  year: string;
  status: string;
  screenshots: string[];
};

// project `type` value -> message key
const typeKey: Record<string, string> = {
  client: "client", side: "side", "final-year": "finalYear", personal: "personal",
};

// Status pill: reads as proof of shipping, not just a thumbnail.
const statusCls: Record<string, string> = {
  live: "text-ok-ink border-ok/40",
  internal: "text-accent-2 border-accent/40",
  archived: "text-muted border-line",
};

export async function ProjectCard({ project }: { project: Project }) {
  const tt = await getTranslations("projectType");
  const ts = await getTranslations("projectStatus");
  const tc = await getTranslations("common");
  const cover = project.screenshots?.[0];
  const status = statusCls[project.status] ? project.status : "archived";
  return (
    <Link
      href={project.url}
      className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-line bg-card transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-accent/50"
    >
      {/* The cover morphs into the first gallery image on the case-study page. */}
      <ViewTransition name={coverTransitionName(project.slug)} share="morph" default="none">
        <div className="relative aspect-[16/10] overflow-hidden bg-canvas">
          {cover ? (
            <Image
              src={cover}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted">{tc("noPreview")}</div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-canvas/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted backdrop-blur">
            {typeKey[project.type] ? tt(typeKey[project.type]) : project.type}
          </span>
        </div>
      </ViewTransition>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-tight">{project.title}</h3>
          <span className="mt-1 shrink-0 font-mono text-xs text-muted">{project.year}</span>
        </div>
        <div className="mt-1.5">
          <span className={`inline-block rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${statusCls[status]}`}>
            {ts(status)}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{project.tagline}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map((s) => (
            <Badge key={s} className="text-[11px]">{s}</Badge>
          ))}
          {project.stack.length > 4 && (
            <Badge className="text-[11px]">+{project.stack.length - 4}</Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
