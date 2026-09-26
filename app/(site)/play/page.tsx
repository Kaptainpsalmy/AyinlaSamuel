import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { TakeABreak } from "@/components/interactive/TakeABreak";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("play");
  return pageMeta({ title: t("metaTitle"), description: t("description"), path: "/play" });
}

export default async function PlayPage() {
  const t = await getTranslations("play");
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header className="mb-10 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-2">{t("kicker")}</p>
        <h1 className="mt-2 text-5xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">{t("lead")}</p>
      </header>

      <div className="rounded-[22px] border border-line bg-card/40 p-6 sm:p-10">
        <TakeABreak />
      </div>
    </section>
  );
}
