import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { MapPin, Briefcase, Building2, Layers, CircleDot, Download, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/common/BrandIcons";
import { site } from "@/content/site";
import { getSidebarStats } from "@/lib/stats";
import { LiveSignals } from "./LiveSignals";
import { LazyTakeABreak } from "@/components/interactive/LazyTakeABreak";

/**
 * Persistent identity rail. Rendered once in the site layout and fixed on the
 * left at lg+, so the profile stays visible on every route (main content is
 * offset with lg:ml-80). On smaller screens it does not render; the top Nav and
 * the mobile bottom bar cover navigation there.
 *
 * Server component: derives its stat rows from content data (never hardcoded).
 */
export async function Sidebar() {
  const t = await getTranslations("sidebar");
  const tp = await getTranslations("profile");
  const { years, companyCount, projectCount } = getSidebarStats();
  const initials = site.shortName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  const metaRows = [
    { key: "location", icon: MapPin, text: site.location },
    { key: "years", icon: Briefcase, text: t("years", { count: years }) },
    { key: "companies", icon: Building2, text: t("companies", { count: companyCount }) },
    { key: "projects", icon: Layers, text: t("projects", { count: projectCount }) },
    {
      key: "status",
      icon: CircleDot,
      text: site.available ? t("available") : t("engaged"),
      ok: site.available,
    },
  ];

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-72 lg:flex-col lg:gap-6 lg:overflow-y-auto lg:border-r lg:border-line lg:bg-canvas lg:px-6 lg:py-8">
      {/* identity */}
      <div className="flex flex-col gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-feature font-bold text-feature-ink">
          {initials}
        </div>
        <div>
          <p className="text-lg font-bold leading-tight">{site.name}</p>
          <p className="mt-1 text-sm text-muted">{tp("role")}</p>
        </div>
        <p className="text-sm leading-relaxed text-muted">{tp("tagline")}</p>
      </div>

      {/* meta rows (derived) */}
      <ul className="flex flex-col gap-2 border-t border-line pt-4 text-sm text-muted">
        {metaRows.map(({ key, icon: Icon, text, ok }) => (
          <li key={key} className="flex items-center gap-2">
            <Icon size={15} className={ok ? "text-ok" : "text-accent-2"} />
            <span>{text}</span>
          </li>
        ))}
      </ul>

      {/* socials */}
      <div className="flex items-center gap-4 border-t border-line pt-4">
        <a href={site.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted transition-colors hover:text-ink">
          <GithubIcon size={18} />
        </a>
        <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted transition-colors hover:text-ink">
          <LinkedinIcon size={18} />
        </a>
        <a href={site.socials.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted transition-colors hover:text-ink">
          <TwitterIcon size={18} />
        </a>
      </div>

      {/* live signals */}
      <LiveSignals />

      {/* take a break: a quick puzzle, in the spot the reference site puts its
          cassette. Compact here; the full game lives at /play. */}
      <LazyTakeABreak />

      {/* actions pinned to the bottom */}
      <div className="mt-auto flex items-center gap-2 pt-4">
        <Link
          href="/cv"
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-canvas transition-opacity hover:opacity-90"
        >
          <Download size={15} /> {t("downloadCv")}
        </Link>
        <a
          href={`mailto:${site.email}`}
          aria-label={t("email")}
          className="flex items-center justify-center rounded-full border border-line p-2.5 text-ink transition-colors hover:border-accent"
        >
          <Mail size={16} />
        </a>
      </div>
    </aside>
  );
}
