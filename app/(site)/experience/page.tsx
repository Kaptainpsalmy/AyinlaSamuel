import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { experience, type Role } from "@/content/experience";
import { Badge } from "@/components/ui/Badge";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("experience");
  return pageMeta({ title: t("title"), description: t("description"), path: "/experience" });
}

// Employment type -> message key (keys cannot contain the hyphen in "Full-time").
const typeKey: Record<Role["type"], string> = {
  Internship: "internship",
  "Full-time": "fullTime",
  Contract: "contract",
  Freelance: "freelance",
  Founder: "founder",
};

export default async function ExperiencePage() {
  const t = await getTranslations("experience");
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header className="mb-12">
        <h1 className="text-5xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-3 text-muted">{t("lead")}</p>
      </header>

      {/* Role details (blurbs and bullet points) stay English: they are content. */}
      <Stagger as="ol" className="relative border-l border-line">
        {experience.map((role) => (
          <StaggerItem as="li" key={role.company + role.role} className="relative mb-10 ml-6">
            {/* Anchored to the li (ml-6 = 24px, + 7px to centre on the line) so the
                dot stays on the line while the item animates with a transform. */}
            <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-canvas bg-accent" />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-xl font-semibold">{role.role}</h2>
              <span className="font-mono text-xs text-muted">
                {role.start && role.end ? `${role.start} - ${role.end}` : role.end || t("ongoing")}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="text-accent-2">{role.company}</span>
              <Badge className="text-[11px]">{t(`type.${typeKey[role.type]}`)}</Badge>
            </div>
            <p className="mt-2 text-sm italic text-muted">{role.blurb}</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted">
              {role.points.map((pt, j) => <li key={j}>{pt}</li>)}
            </ul>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
