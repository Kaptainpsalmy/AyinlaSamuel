import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";
import { projects, notes } from "@/.velite";
import { site } from "@/content/site";
import { experience } from "@/content/experience";
import { services } from "@/content/services";
import { allSkills } from "@/content/skills";
import { RotatingHero } from "@/components/hero/RotatingHero";
import { NowStrip } from "@/components/sections/NowStrip";
import { ContribGraph } from "@/components/sections/ContribGraph";
import { FeaturedReel } from "@/components/sections/FeaturedReel";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/common/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Magnetic } from "@/components/motion/Magnetic";
import { ThemedIllustration } from "@/components/illustrations/ThemedIllustration";
import { JsonLd } from "@/components/common/JsonLd";
import { personLd, websiteLd } from "@/lib/seo";

const featured = [...projects].filter((p) => p.featured).sort((a, b) => a.order - b.order).slice(0, 6);
const recentNotes = [...notes].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
const topRoles = experience.filter((r) => !r.confidential).slice(0, 3);

// Cards lift slightly on hover; transform only, so nothing reflows.
const lift = "transition-[transform,border-color] duration-200 hover:-translate-y-0.5";

export default async function Home() {
  const t = await getTranslations("home");
  const tp = await getTranslations("profile");
  const format = await getFormatter();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <JsonLd data={[personLd(), websiteLd()]} />
      {/* 1. HERO: not wrapped in a reveal, so the largest paint is never delayed */}
      <section className="grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent-2">
            <span className="inline-block h-2 w-2 rounded-full bg-ok" /> {t("available", { location: site.location })}
          </p>
          <h1 className="mt-5 text-[clamp(2.5rem,8vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.04em]">
            {site.shortName}
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">
            {t("heroLead", { role: tp("role") })}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <Link href="/projects" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-canvas hover:opacity-90">
                {t("viewWork")} <ArrowRight size={16} />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm hover:border-accent">
                {t("getInTouch")}
              </Link>
            </Magnetic>
          </div>
          <div className="mt-8"><NowStrip /></div>
        </div>
        <RotatingHero />
      </section>

      {/* 2. FEATURED REEL */}
      <Reveal>
        <section className="py-12">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold">{t("featuredWork")}</h2>
            <Link href="/projects" className="text-sm text-muted hover:text-ink">{t("allProjects")} &rarr;</Link>
          </div>
          <FeaturedReel items={featured} />
        </section>
      </Reveal>

      {/* 3. ABOUT teaser (bio stays English: long-form copy, like case studies) */}
      <Reveal>
        <section className="grid items-center gap-10 border-t border-line py-16 md:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold">{t("about")}</h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted">{site.bio[0]}</p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {allSkills.slice(0, 10).map((s) => <Badge key={s}>{s}</Badge>)}
            </div>
            <Link href="/about" className="mt-6 inline-flex items-center gap-1.5 text-sm text-accent-2 hover:underline">
              {t("moreAboutMe")} <ArrowRight size={14} />
            </Link>
          </div>
          <div className="text-accent">
            <ThemedIllustration name="hero" className="animate-float mx-auto h-56 w-full max-w-sm md:h-64" />
          </div>
        </section>
      </Reveal>

      {/* 3b. CONTRIBUTIONS */}
      <Reveal>
        <section className="border-t border-line py-16">
          <ContribGraph />
        </section>
      </Reveal>

      {/* 4. EXPERIENCE teaser */}
      <section className="border-t border-line py-16">
        <Reveal>
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold">{t("experience")}</h2>
            <Link href="/experience" className="text-sm text-muted hover:text-ink">{t("fullHistory")} &rarr;</Link>
          </div>
        </Reveal>
        <Stagger className="space-y-3">
          {topRoles.map((r) => (
            <StaggerItem key={r.company + r.role} className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-line p-4">
              <div>
                <span className="font-medium">{r.role}</span>
                <span className="text-muted"> {t("at", { company: r.company })}</span>
              </div>
              <span className="font-mono text-xs text-muted">{r.start && r.end ? `${r.start} - ${r.end}` : r.end}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* 5. SERVICES */}
      <section className="border-t border-line py-16">
        <Reveal>
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold">{t("services")}</h2>
            <Link href="/services" className="text-sm text-muted hover:text-ink">{t("allServices")} &rarr;</Link>
          </div>
        </Reveal>
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.slice(0, 4).map((s) => (
            <StaggerItem key={s.title}>
              <Card className={"h-full " + lift}>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent-2"><Icon name={s.icon} size={20} /></span>
                <h3 className="mt-3 font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted line-clamp-2">{s.description}</p>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* 6. RECENT NOTES */}
      <section className="border-t border-line py-16">
        <Reveal>
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold">{t("recentNotes")}</h2>
            <Link href="/notes" className="text-sm text-muted hover:text-ink">{t("allNotes")} &rarr;</Link>
          </div>
        </Reveal>
        <Stagger className="grid gap-4 sm:grid-cols-3">
          {recentNotes.map((n) => (
            <StaggerItem key={n.slug}>
              <Link href={n.url} className={"block h-full rounded-xl border border-line p-5 hover:border-accent/50 " + lift}>
                <p className="font-mono text-xs text-muted">
                  {format.dateTime(new Date(n.date), { year: "numeric", month: "short", day: "numeric" })}
                </p>
                <h3 className="mt-2 font-semibold leading-tight">{n.title}</h3>
                <p className="mt-2 text-sm text-muted line-clamp-2">{n.excerpt}</p>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* 7. CONTACT CTA */}
      <Reveal>
        <section className="my-16 rounded-[22px] border border-line bg-card p-10 text-center">
          <h2 className="text-3xl font-bold">{t("ctaTitle")}</h2>
          <p className="mx-auto mt-3 max-w-md text-muted">{t("ctaBody")}</p>
          <Magnetic className="mt-6">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-canvas hover:opacity-90">
              {t("getInTouch")} <ArrowRight size={16} />
            </Link>
          </Magnetic>
        </section>
      </Reveal>
    </div>
  );
}
