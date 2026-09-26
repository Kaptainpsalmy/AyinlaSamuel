import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { services } from "@/content/services";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/common/Icon";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("services");
  return pageMeta({ title: t("title"), description: t("description"), path: "/services" });
}

export default async function ServicesPage() {
  const t = await getTranslations("services");
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <header className="mb-10">
        <h1 className="text-5xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-3 max-w-xl text-muted">{t("lead")}</p>
      </header>
      {/* Service titles and descriptions stay English: they are content. */}
      <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <StaggerItem key={s.title}>
            <Card className="h-full transition-transform duration-200 hover:-translate-y-0.5">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent-2">
                <Icon name={s.icon} />
              </span>
              <h2 className="mt-4 text-lg font-semibold">{s.title}</h2>
              <p className="mt-2 text-sm text-muted">{s.description}</p>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
