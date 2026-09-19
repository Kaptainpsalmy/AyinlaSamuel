import { experience } from "@/content/experience";
import { Badge } from "@/components/ui/Badge";

export const metadata = { title: "Experience", description: "Roles, companies, and what I built." };

export default function ExperiencePage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header className="mb-12">
        <h1 className="text-5xl font-bold tracking-tight">Experience</h1>
        <p className="mt-3 text-muted">Where I have worked and what I built.</p>
      </header>

      <ol className="relative border-l border-line">
        {experience.map((role, i) => (
          <li key={i} className="mb-10 ml-6">
            <span className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full border-2 border-canvas bg-accent" />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-xl font-semibold">{role.role}</h2>
              <span className="font-mono text-xs text-muted">
                {role.start && role.end ? `${role.start} - ${role.end}` : role.end || "Ongoing"}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="text-accent-2">{role.company}</span>
              <Badge className="text-[11px]">{role.type}</Badge>
            </div>
            <p className="mt-2 text-sm italic text-muted">{role.blurb}</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted">
              {role.points.map((pt, j) => <li key={j}>{pt}</li>)}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}
