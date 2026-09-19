import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

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

const typeLabel: Record<string, string> = {
  client: "Client", side: "Side", "final-year": "Final year", personal: "Personal",
};

export function ProjectCard({ project }: { project: Project }) {
  const cover = project.screenshots?.[0];
  return (
    <Link
      href={project.url}
      className="group flex flex-col overflow-hidden rounded-[22px] border border-line bg-card transition-colors hover:border-accent/50"
    >
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
          <div className="flex h-full items-center justify-center text-muted">No preview</div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-canvas/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted backdrop-blur">
          {typeLabel[project.type] ?? project.type}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-tight">{project.title}</h3>
          <span className="mt-1 shrink-0 font-mono text-xs text-muted">{project.year}</span>
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
