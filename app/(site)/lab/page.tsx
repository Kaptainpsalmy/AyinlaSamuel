import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { ApiPlayground } from "@/components/interactive/ApiPlayground";
import { ArchitectureExplorer } from "@/components/interactive/ArchitectureExplorer";
import { Reveal } from "@/components/motion/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("lab");
  return pageMeta({ title: t("metaTitle"), description: t("description"), path: "/lab" });
}

export default async function LabPage() {
  const t = await getTranslations("lab");
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <header className="mb-10">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-2">{t("metaTitle")}</p>
        <h1 className="mt-2 text-5xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-3 max-w-xl text-muted">{t("lead")}</p>
      </header>

      <div className="space-y-12">
        <Reveal>
          <h2 className="text-xl font-semibold">{t("apiTitle")}</h2>
          <p className="mb-5 mt-1 text-sm text-muted">{t("apiLead")}</p>
          <ApiPlayground />
        </Reveal>

        <Reveal className="border-t border-line pt-10">
          <h2 className="text-xl font-semibold">{t("archTitle")}</h2>
          <p className="mb-5 mt-1 text-sm text-muted">{t("archLead")}</p>
          <ArchitectureExplorer />
        </Reveal>
      </div>
    </section>
  );
}
