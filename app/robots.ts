import type { MetadataRoute } from "next";
import { absolute, siteUrl } from "@/lib/seo";

// Crawl the site, not the internal pages: the styleguide is a dev tool and the
// /api/py JSON endpoints are for the site itself (the docs page is linked, not indexed).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/styleguide", "/api/"] }],
    sitemap: absolute("/sitemap.xml"),
    host: siteUrl,
  };
}
