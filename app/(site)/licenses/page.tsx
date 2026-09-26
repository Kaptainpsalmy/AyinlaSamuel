import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("licenses");
  return pageMeta({ title: t("title"), description: t("description"), path: "/licenses" });
}

// `note` is a message key under licenses.role; names and licenses are proper nouns.
const credits = [
  { name: "Next.js", note: "framework", license: "MIT" },
  { name: "React", note: "ui", license: "MIT" },
  { name: "Tailwind CSS", note: "styling", license: "MIT" },
  { name: "Motion", note: "animation", license: "MIT" },
  { name: "next-intl", note: "i18n", license: "MIT" },
  { name: "cmdk", note: "palette", license: "MIT" },
  { name: "Lucide", note: "icons", license: "ISC" },
  { name: "Velite", note: "content", license: "MIT" },
  { name: "Shiki", note: "highlighting", license: "MIT" },
  { name: "Space Grotesk", note: "displayFont", license: "OFL" },
  { name: "JetBrains Mono", note: "monoFont", license: "OFL" },
  { name: "FastAPI", note: "backend", license: "MIT" },
  { name: "unDraw", note: "illustrations", license: "unDraw" },
];

export default async function LicensesPage() {
  const t = await getTranslations("licenses");
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header className="mb-8">
        <h1 className="text-5xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-3 text-muted">{t("lead")}</p>
      </header>
      <div className="divide-y divide-line rounded-xl border border-line">
        {credits.map((c) => (
          <div key={c.name} className="flex items-center justify-between gap-4 px-5 py-3.5">
            <div>
              <span className="font-medium">{c.name}</span>
              <span className="ml-2 text-sm text-muted">{t(`role.${c.note}`)}</span>
            </div>
            <span className="font-mono text-xs text-muted">{c.license}</span>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-muted">{t("footer")}</p>
    </section>
  );
}
