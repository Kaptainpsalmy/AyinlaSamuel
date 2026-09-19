import Link from "next/link";
import { GithubIcon as Github, LinkedinIcon as Linkedin, TwitterIcon as Twitter } from "@/components/common/BrandIcons";
import { site, nav } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:justify-between">
        <div className="max-w-xs">
          <p className="font-mono text-sm font-bold uppercase tracking-widest">
            {site.brand}<span className="text-accent-2">.</span>
          </p>
          <p className="mt-3 text-sm text-muted">
            {site.role}. Based in {site.location}.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-2">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm text-muted transition-colors hover:text-ink">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-start gap-3">
          <a href={site.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted hover:text-ink"><Github size={18} /></a>
          <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted hover:text-ink"><Linkedin size={18} /></a>
          <a href={site.socials.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted hover:text-ink"><Twitter size={18} /></a>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-muted sm:px-6">
          &copy; {year} {site.brand}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
