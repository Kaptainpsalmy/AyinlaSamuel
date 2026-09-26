import type { MetadataRoute } from "next";
import { projects, notes } from "@/.velite";
import { absolute } from "@/lib/seo";

// Every public page, project, and note. `lastModified` is only set where the
// date is real (notes); search engines ignore dates that are always "now".
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/projects", priority: 0.9 },
    { path: "/about", priority: 0.8 },
    { path: "/experience", priority: 0.8 },
    { path: "/cv", priority: 0.8 },
    { path: "/contact", priority: 0.7 },
    { path: "/notes", priority: 0.7 },
    { path: "/lab", priority: 0.7 },
    { path: "/skills", priority: 0.6 },
    { path: "/services", priority: 0.6 },
    { path: "/play", priority: 0.4 },
    { path: "/licenses", priority: 0.2 },
  ];

  return [
    ...pages.map((p) => ({ url: absolute(p.path), priority: p.priority })),
    ...projects.map((p) => ({ url: absolute(p.url), priority: p.featured ? 0.8 : 0.6 })),
    ...notes.map((n) => ({ url: absolute(n.url), lastModified: new Date(n.date), priority: 0.6 })),
  ];
}
