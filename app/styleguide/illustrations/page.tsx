import { ThemedIllustration } from "@/components/illustrations/ThemedIllustration";
import { RagDiagram, PaymentDiagram, AgentDiagram } from "@/components/illustrations";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

/**
 * Preview of the licensed (unDraw, recolored) illustrations plus the bespoke
 * engineering diagrams. ThemedIllustration fetches and inlines each SVG file
 * on the client. Toggle the theme to confirm they adapt.
 */
export default function IllustrationsPreview() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-10 flex items-center justify-between border-b border-line pb-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-2">Assets</p>
          <h1 className="mt-2 text-4xl font-bold">Illustrations & diagrams</h1>
        </div>
        <ThemeToggle />
      </div>

      <h2 className="mb-1 text-xl font-semibold">Licensed art (unDraw, recolored to tokens)</h2>
      <p className="mb-6 text-sm text-muted">
        Accent follows the accent token, line-work follows ink, panels follow card, skin tones
        kept natural. Toggle the theme to confirm both modes.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          ["hero", "Hero: developer / dev platform"],
          ["connect", "Connect: high five"],
          ["server", "Server: backend"],
          ["notfound", "404: page not found"],
        ].map(([name, caption]) => (
          <div key={name} className="rounded-xl border border-line p-4">
            <div className="text-accent">
              <ThemedIllustration name={name} className="h-56 w-full" />
            </div>
            <p className="mt-3 text-center text-sm text-muted">{caption}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-1 mt-14 text-xl font-semibold">Bespoke engineering diagrams</h2>
      <p className="mb-6 text-sm text-muted">Hand-built, on-brand, double as case-study figures.</p>
      <div className="space-y-4">
        <div className="rounded-xl border border-line p-4 text-ink overflow-x-auto">
          <RagDiagram className="h-28 min-w-[680px]" />
          <p className="mt-2 text-sm text-muted">RAG pipeline</p>
        </div>
        <div className="rounded-xl border border-line p-4 text-ink overflow-x-auto">
          <PaymentDiagram className="h-44 min-w-[560px]" />
          <p className="mt-2 text-sm text-muted">Payment lifecycle</p>
        </div>
        <div className="rounded-xl border border-line p-4 text-ink overflow-x-auto">
          <AgentDiagram className="h-48 min-w-[560px]" />
          <p className="mt-2 text-sm text-muted">Agent workflow</p>
        </div>
      </div>
    </main>
  );
}
