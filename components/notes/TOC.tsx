"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type Head = { id: string; text: string; level: number };

/** Builds a table of contents from the rendered h2/h3 in the article. */
export function TOC() {
  const t = useTranslations("note");
  const [heads, setHeads] = useState<Head[]>([]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll("article h2, article h3")) as HTMLElement[];
    const hs = nodes.map((n) => {
      if (!n.id) n.id = n.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ?? "";
      return { id: n.id, text: n.textContent ?? "", level: n.tagName === "H3" ? 3 : 2 };
    });
    setHeads(hs);
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive((e.target as HTMLElement).id); }),
      { rootMargin: "-80px 0px -70% 0px" }
    );
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);

  if (heads.length < 2) return null;
  return (
    <nav aria-label={t("tocLabel")} className="hidden text-sm lg:block">
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted">{t("onThisPage")}</p>
      <ul className="space-y-2 border-l border-line">
        {heads.map((h) => (
          <li key={h.id} style={{ paddingLeft: h.level === 3 ? 24 : 12 }}>
            <a href={`#${h.id}`}
              className={"block border-l-2 -ml-px pl-3 transition-colors " + (active === h.id ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink")}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
