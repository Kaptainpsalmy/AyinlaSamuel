import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { site } from "@/content/site";
import { ContactForm } from "@/components/contact/ContactForm";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/common/BrandIcons";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { ThemedIllustration } from "@/components/illustrations/ThemedIllustration";
import { Reveal } from "@/components/motion/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact");
  return pageMeta({ title: t("metaTitle"), description: t("description"), path: "/contact" });
}

export default async function ContactPage() {
  const t = await getTranslations("contact");
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-5xl font-bold tracking-tight">{t("title")}</h1>
          <p className="mt-3 max-w-xl text-muted">{t("lead")}</p>
        </div>
        <div className="text-accent">
          <ThemedIllustration name="connect" className="h-32 w-48 shrink-0 sm:h-40 sm:w-60" />
        </div>
      </header>

      <Reveal className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
        {/* direct contact */}
        <div className="space-y-4">
          <a href={`mailto:${site.email}`} className="flex items-center gap-3 rounded-xl border border-line p-4 hover:border-accent/50">
            <Mail size={18} className="text-accent-2" />
            <span><span className="block text-xs text-muted">{t("email")}</span><span className="text-sm">{site.email}</span></span>
          </a>
          <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 rounded-xl border border-line p-4 hover:border-accent/50">
            <Phone size={18} className="text-accent-2" />
            <span><span className="block text-xs text-muted">{t("phone")}</span><span className="text-sm">{site.phone}</span></span>
          </a>
          <a href={site.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-line p-4 hover:border-accent/50">
            <MessageCircle size={18} className="text-accent-2" />
            <span><span className="block text-xs text-muted">WhatsApp</span><span className="text-sm">{site.phone}</span></span>
          </a>
          <div className="flex gap-3 pt-2">
            <a href={site.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted hover:text-ink"><GithubIcon size={20} /></a>
            <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted hover:text-ink"><LinkedinIcon size={20} /></a>
            <a href={site.socials.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted hover:text-ink"><TwitterIcon size={20} /></a>
          </div>
        </div>

        {/* form */}
        <div className="rounded-[22px] border border-line bg-card p-6">
          <ContactForm />
        </div>
      </Reveal>
    </section>
  );
}
