import { site } from "@/content/site";
import { certifications } from "@/content/certifications";
import { Card } from "@/components/ui/Card";
import { ExternalLink, GraduationCap, Award } from "lucide-react";

export const metadata = { title: "About", description: site.bio[0] };

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header className="mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-accent-2">About</p>
        <h1 className="mt-3 text-5xl font-bold tracking-tight">{site.shortName}</h1>
        <p className="mt-3 text-lg text-muted">{site.role}, based in {site.location}.</p>
      </header>

      <div className="space-y-4">
        {site.bio.map((p, i) => (
          <p key={i} className="leading-relaxed text-muted">{p}</p>
        ))}
      </div>

      {/* Education */}
      <div className="mt-12">
        <h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
          <GraduationCap size={15} /> Education
        </h2>
        <Card className="mt-3">
          <h3 className="text-lg font-semibold">{site.education.degree}</h3>
          <p className="mt-1 text-muted">{site.education.school}</p>
          <p className="text-sm text-muted">{site.education.location}</p>
        </Card>
      </div>

      {/* Certifications */}
      <div className="mt-12">
        <h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
          <Award size={15} /> Certifications
        </h2>
        <div className="mt-3 space-y-2">
          {certifications.map((c) => (
            <div key={c.title} className="flex items-center justify-between gap-3 rounded-xl border border-line p-4">
              <div>
                <p className="font-medium">{c.title}</p>
                <p className="text-sm text-muted">{c.issuer}{c.year ? ` (${c.year})` : ""}</p>
              </div>
              {c.link && (
                <a href={c.link} target="_blank" rel="noopener noreferrer"
                   className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-muted hover:text-ink">
                  <ExternalLink size={13} /> Verify
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
