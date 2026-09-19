"use client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

const swatches = [
  ["canvas", "--color-canvas"], ["ink", "--color-ink"], ["muted", "--color-muted"],
  ["accent", "--color-accent"], ["accent-2", "--color-accent-2"], ["card", "--color-card"],
  ["feature", "--color-feature"], ["ok", "--color-ok"], ["warn", "--color-warn"],
];

export default function StyleGuide() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-10 flex items-center justify-between border-b border-line pb-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-2">Design system</p>
          <h1 className="mt-2 text-4xl font-bold">Kinetic Minimal</h1>
        </div>
        <ThemeToggle />
      </div>

      {/* Color */}
      <section className="mb-14">
        <h2 className="mb-4 text-xl font-semibold">Color tokens</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {swatches.map(([name, v]) => (
            <div key={name} className="rounded-xl border border-line p-3">
              <div className="h-14 w-full rounded-lg border border-line" style={{ background: `var(${v})` }} />
              <p className="mt-2 font-mono text-xs">{name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Type */}
      <section className="mb-14">
        <h2 className="mb-4 text-xl font-semibold">Typography — Space Grotesk / JetBrains Mono</h2>
        <div className="space-y-2">
          <p style={{ fontSize: "clamp(2.5rem,7vw,5.5rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 0.95 }}>Ayinla Samuel</p>
          <p className="text-3xl font-semibold">Heading 2 — section title</p>
          <p className="text-xl font-medium">Heading 3 — card title</p>
          <p className="text-base text-muted">Body — a full-stack engineer building for the web and everything under it.</p>
          <p className="font-mono text-sm text-accent-2">GET /api/py/now → 200 · 42ms</p>
        </div>
      </section>

      {/* Buttons */}
      <section className="mb-14">
        <h2 className="mb-4 text-xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button size="sm" variant="outline">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      {/* Cards */}
      <section className="mb-14">
        <h2 className="mb-4 text-xl font-semibold">Cards</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card feature>
            <p className="font-mono text-xs uppercase tracking-widest opacity-70">Feature card</p>
            <h3 className="mt-2 text-2xl font-bold">Prediction Engine</h3>
            <p className="mt-2 opacity-80">The anchor card — black on light, indigo on dark.</p>
          </Card>
          <Card>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Standard card</p>
            <h3 className="mt-2 text-2xl font-bold">SabreCWA</h3>
            <p className="mt-2 text-muted">Bordered surface for secondary content.</p>
            <div className="mt-4 flex gap-2">
              <Badge>FastAPI</Badge><Badge>Postgres</Badge><Badge>Next.js</Badge>
            </div>
          </Card>
        </div>
      </section>

      {/* Motion */}
      <section className="mb-14">
        <h2 className="mb-4 text-xl font-semibold">Motion (scroll to trigger; off under reduced-motion)</h2>
        <Reveal><Card><p>Reveal — fades up when it enters the viewport.</p></Card></Reveal>
        <Stagger className="mt-4 grid gap-3 sm:grid-cols-3">
          {["One", "Two", "Three"].map((t) => (
            <StaggerItem key={t}><Card><p className="text-center">{t}</p></Card></StaggerItem>
          ))}
        </Stagger>
      </section>
    </main>
  );
}

