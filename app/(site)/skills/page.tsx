import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { skills } from "@/content/skills";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("skills");
  return pageMeta({ title: t("title"), description: t("description"), path: "/skills" });
}

// Group label -> message key. Skill names themselves (FastAPI, React...) are
// proper nouns and stay as written.
const groupKey: Record<string, string> = {
  Backend: "backend",
  "AI & ML": "aiMl",
  Frontend: "frontend",
  "Data & Infra": "dataInfra",
};

export default async function SkillsPage() {
  const t = await getTranslations("skills");
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <header className="mb-10">
        <h1 className="text-5xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-3 text-muted">{t("lead")}</p>
      </header>
      <Stagger className="grid gap-5 sm:grid-cols-2">
        {skills.map((group) => (
          <StaggerItem key={group.label}>
            <Card className="h-full">
              <h2 className="font-mono text-xs uppercase tracking-widest text-accent-2">
                {groupKey[group.label] ? t(`group.${groupKey[group.label]}`) : group.label}
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.skills.map((s) => <Badge key={s} className="text-sm">{s}</Badge>)}
              </div>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
