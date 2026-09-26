/**
 * Renders schema.org structured data. `<` is escaped to its unicode form so a
 * string in the data can never close the script tag (the XSS guard the Next.js
 * JSON-LD guide recommends).
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
