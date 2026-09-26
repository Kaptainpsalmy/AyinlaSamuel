import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { site } from "@/content/site";
import { experience } from "@/content/experience";
import { skills } from "@/content/skills";
import { certifications } from "@/content/certifications";
import { projects } from "@/.velite";
import { CvActions } from "@/components/cv/CvActions";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("cv");
  return pageMeta({ title: "CV", description: t("description"), path: "/cv" });
}

const featured = [...projects].filter((p) => p.featured).sort((a, b) => a.order - b.order).slice(0, 6);

export default async function CvPage() {
  const t = await getTranslations("cv");
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 print:max-w-none print:py-0">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted">{t("englishNote")}</p>
        </div>
        <CvActions />
      </div>

      {/* The CV document stays English on purpose: it must match the PDF that
          recruiters download, and that is the language they read it in. */}
      <article lang="en" className="cv space-y-8 print:text-black">
        {/* header */}
        <header className="border-b border-line pb-6 print:border-black/20">
          <h2 className="text-3xl font-bold">{site.name}</h2>
          <p className="mt-1 text-accent-2 print:text-black">{site.role}</p>
          <p className="mt-2 text-sm text-muted print:text-black/70">
            {site.locationFull} &middot; {site.email} &middot; {site.phone}
          </p>
          <p className="mt-1 text-sm text-muted print:text-black/70">
            github.com/{site.githubUser} &middot; {site.socials.linkedin.replace("https://www.", "")}
          </p>
        </header>

        {/* profile */}
        <section>
          <h3 className="font-mono text-xs uppercase tracking-widest text-muted print:text-black/60">Profile</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted print:text-black">{site.bio[0]}</p>
        </section>

        {/* experience */}
        <section>
          <h3 className="font-mono text-xs uppercase tracking-widest text-muted print:text-black/60">Experience</h3>
          <div className="mt-3 space-y-4">
            {experience.map((r, i) => (
              <div key={i}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold">{r.role} <span className="font-normal text-muted print:text-black/70">at {r.company}</span></p>
                  <span className="font-mono text-xs text-muted print:text-black/60">{r.start && r.end ? `${r.start} - ${r.end}` : r.end || ""}</span>
                </div>
                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-muted print:text-black">
                  {r.points.map((pt, j) => <li key={j}>{pt}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* skills */}
        <section>
          <h3 className="font-mono text-xs uppercase tracking-widest text-muted print:text-black/60">Skills</h3>
          <div className="mt-2 space-y-1 text-sm">
            {skills.map((g) => (
              <p key={g.label} className="text-muted print:text-black"><span className="font-medium text-ink print:text-black">{g.label}:</span> {g.skills.join(", ")}</p>
            ))}
          </div>
        </section>

        {/* selected projects */}
        <section>
          <h3 className="font-mono text-xs uppercase tracking-widest text-muted print:text-black/60">Selected Projects</h3>
          <div className="mt-2 space-y-2 text-sm">
            {featured.map((p) => (
              <p key={p.slug} className="text-muted print:text-black"><span className="font-medium text-ink print:text-black">{p.title}.</span> {p.tagline}</p>
            ))}
          </div>
        </section>

        {/* education + certs */}
        <div className="grid gap-8 sm:grid-cols-2">
          <section>
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted print:text-black/60">Education</h3>
            <p className="mt-2 text-sm font-medium">{site.education.degree}</p>
            <p className="text-sm text-muted print:text-black/70">{site.education.school}</p>
          </section>
          <section>
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted print:text-black/60">Certifications</h3>
            <ul className="mt-2 space-y-1 text-sm text-muted print:text-black">
              {certifications.map((c) => <li key={c.title}>{c.title}, {c.issuer}{c.year ? ` (${c.year})` : ""}</li>)}
            </ul>
          </section>
        </div>
      </article>
    </div>
  );
}
