import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { ThemedIllustration } from "@/components/illustrations/ThemedIllustration";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <div className="text-accent">
        <ThemedIllustration
          name="notfound"
          label={t("imageLabel")}
          className="mx-auto h-56 w-full max-w-md sm:h-72"
        />
      </div>
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-2">404</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-3 text-muted">{t("lead")}</p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-canvas hover:opacity-90"
      >
        <ArrowLeft size={16} /> {t("home")}
      </Link>
    </section>
  );
}
