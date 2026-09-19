import { notes } from "@/.velite";
import { site } from "@/content/site";

export const dynamic = "force-static";

export function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://psalmnova.vercel.app";
  const items = [...notes]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(
      (n) => `    <item>
      <title>${escapeXml(n.title)}</title>
      <link>${base}${n.url}</link>
      <guid>${base}${n.url}</guid>
      <pubDate>${new Date(n.date).toUTCString()}</pubDate>
      <description>${escapeXml(n.excerpt)}</description>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${site.brand} Notes</title>
    <link>${base}/notes</link>
    <description>Engineering notes by ${site.name}.</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}

function escapeXml(s: string) {
  return s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]!));
}
