import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { projects, notes } from "@/.velite";
import { site } from "@/content/site";
import { experience } from "@/content/experience";
import { services } from "@/content/services";
import { allSkills } from "@/content/skills";
import { RotatingHero } from "@/components/hero/RotatingHero";
import { FeaturedReel } from "@/components/sections/FeaturedReel";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/common/Icon";
import { Reveal } from "@/components/motion/Reveal";

const featured = [...projects].filter((p) => p.featured).sort((a, b) => a.order - b.order).slice(0, 6);
const recentNotes = [...notes].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
const topRoles = experience.filter((r) => !r.confidential).slice(0, 3);

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* 1. HERO */}
      <section className="grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent-2">
            <span className="inline-block h-2 w-2 rounded-full bg-ok" /> Available for work, {site.location}
          </p>
          <h1 className="mt-5 text-[clamp(2.5rem,8vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.04em]">
            {site.shortName}
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">
            {site.role}. I build the API, the model, and the pipeline in between.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/projects" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-canvas hover:opacity-90">
              View work <ArrowRight size={16} />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm hover:border-accent">
              Get in touch
            </Link>
          </div>
        </div>
        <RotatingHero />
      </section>

      {/* 2. FEATURED REEL */}
      <section className="py-12">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold">Featured work</h2>
          <Link href="/projects" className="text-sm text-muted hover:text-ink">All projects &rarr;</Link>
        </div>
        <FeaturedReel items={featured} />
      </section>

      {/* 3. ABOUT teaser */}
      <Reveal>
        <section className="border-t border-line py-16">
          <h2 className="text-2xl font-bold">About</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted">{site.bio[0]}</p>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {allSkills.slice(0, 10).map((s) => <Badge key={s}>{s}</Badge>)}
          </div>
          <Link href="/about" className="mt-6 inline-flex items-center gap-1.5 text-sm text-accent-2 hover:underline">
            More about me <ArrowRight size={14} />
          </Link>
        </section>
      </Reveal>

      {/* 4. EXPERIENCE teaser */}
      <Reveal>
        <section className="border-t border-line py-16">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold">Experience</h2>
            <Link href="/experience" className="text-sm text-muted hover:text-ink">Full history &rarr;</Link>
          </div>
          <div className="space-y-3">
            {topRoles.map((r, i) => (
              <div key={i} className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-line p-4">
                <div>
                  <span className="font-medium">{r.role}</span>
                  <span className="text-muted"> at {r.company}</span>
                </div>
                <span className="font-mono text-xs text-muted">{r.start && r.end ? `${r.start} - ${r.end}` : r.end}</span>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 5. SERVICES */}
      <Reveal>
        <section className="border-t border-line py-16">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold">Services</h2>
            <Link href="/services" className="text-sm text-muted hover:text-ink">All services &rarr;</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.slice(0, 4).map((s) => (
              <Card key={s.title}>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent-2"><Icon name={s.icon} size={20} /></span>
                <h3 className="mt-3 font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted line-clamp-2">{s.description}</p>
              </Card>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 6. RECENT NOTES */}
      <Reveal>
        <section className="border-t border-line py-16">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold">Recent notes</h2>
            <Link href="/notes" className="text-sm text-muted hover:text-ink">All notes &rarr;</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {recentNotes.map((n) => (
              <Link key={n.slug} href={n.url} className="rounded-xl border border-line p-5 hover:border-accent/50">
                <p className="font-mono text-xs text-muted">{new Date(n.date).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" })}</p>
                <h3 className="mt-2 font-semibold leading-tight">{n.title}</h3>
                <p className="mt-2 text-sm text-muted line-clamp-2">{n.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 7. CONTACT CTA */}
      <Reveal>
        <section className="my-16 rounded-[22px] border border-line bg-card p-10 text-center">
          <h2 className="text-3xl font-bold">Let us build something</h2>
          <p className="mx-auto mt-3 max-w-md text-muted">
            Available for full-time roles, freelance work, and collaborations.
          </p>
          <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-canvas hover:opacity-90">
            Get in touch <ArrowRight size={16} />
          </Link>
        </section>
      </Reveal>
    </div>
  );
}
