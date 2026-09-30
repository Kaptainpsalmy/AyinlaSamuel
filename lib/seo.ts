/**
 * SEO helpers: the canonical site URL, per-page metadata, and schema.org JSON-LD
 * builders. Every route builds its metadata through `pageMeta` so canonical
 * URLs, share previews, and the RSS link are never forgotten on a page.
 */
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { site } from "@/content/site";
import { allSkills } from "@/content/skills";

/** Absolute origin, without a trailing slash. Set NEXT_PUBLIC_SITE_URL in Vercel. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://psalmnova.vercel.app").replace(/\/+$/, "");
export const absolute = (path: string) => `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

/** The generated default share card (app/opengraph-image.tsx). */
export const DEFAULT_OG_IMAGE = "/opengraph-image";

const rss = { "application/rss+xml": [{ url: "/feed.xml", title: "PsalmNova Notes" }] };

/**
 * Metadata for one page. Next merges metadata shallowly, so a page that sets
 * `openGraph` replaces the layout's entirely; this helper therefore always
 * restates the share image, canonical URL, and RSS link.
 *
 * `ogImage: null` leaves the image out, for routes that have their own
 * opengraph-image file (the file convention supplies it).
 */
export async function pageMeta({
  title,
  description,
  path,
  type = "website",
  ogImage = DEFAULT_OG_IMAGE,
  publishedTime,
}: {
  title?: string;
  description: string;
  path: string;
  type?: "website" | "article" | "profile";
  ogImage?: string | null;
  publishedTime?: string;
}): Promise<Metadata> {
  const locale = await getLocale();
  const ogTitle = title ? `${title} | ${site.brand}` : `${site.shortName} | ${site.brand}`;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path, types: rss },
    openGraph: {
      type,
      url: path,
      siteName: site.brand,
      title: ogTitle,
      description,
      locale: locale === "yo" ? "yo_NG" : "en_NG",
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }] } : {}),
      ...(publishedTime ? { publishedTime, authors: [site.name] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      creator: "@kaptainpsalmy",
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

// ---- JSON-LD (schema.org) -------------------------------------------------

const personId = `${siteUrl}/#person`;

/** Samuel, as a schema.org Person. Other entities reference him by @id. */
export function personLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: site.name,
    alternateName: [site.shortName, site.brand],
    jobTitle: "Full-Stack Software Engineer",
    description: site.bio[0],
    url: siteUrl,
    email: `mailto:${site.email}`,
    address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
    alumniOf: { "@type": "CollegeOrUniversity", name: site.education.school },
    knowsAbout: allSkills,
    knowsLanguage: site.languages,
    sameAs: [site.socials.github, site.socials.linkedin, site.socials.twitter],
  };
}

type ProjectLike = {
  title: string;
  tagline: string;
  url: string;
  stack: string[];
  year: string;
  links: { live?: string; repo?: string };
  screenshots: string[];
};

/** A case study as SoftwareSourceCode (a real system Samuel built). */
export function projectLd(p: ProjectLike) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: p.title,
    description: p.tagline,
    url: absolute(p.url),
    author: { "@id": personId },
    dateCreated: p.year,
    keywords: p.stack.join(", "),
    ...(p.links.repo ? { codeRepository: p.links.repo } : {}),
    ...(p.links.live ? { sameAs: p.links.live } : {}),
    ...(p.screenshots[0] ? { image: absolute(p.screenshots[0]) } : {}),
  };
}

type NoteLike = { title: string; excerpt: string; url: string; date: string; tags: string[]; metadata: { wordCount: number } };

export function noteLd(n: NoteLike) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: n.title,
    description: n.excerpt,
    url: absolute(n.url),
    mainEntityOfPage: absolute(n.url),
    datePublished: n.date,
    author: { "@id": personId, "@type": "Person", name: site.name },
    keywords: n.tags.join(", "),
    wordCount: n.metadata.wordCount,
    // Per-note cards live at a hashed URL, so reference the stable default card.
    image: absolute(DEFAULT_OG_IMAGE),
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.brand,
    url: siteUrl,
    author: { "@id": personId },
    inLanguage: ["en", "yo"],
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absolute(it.path),
    })),
  };
}
