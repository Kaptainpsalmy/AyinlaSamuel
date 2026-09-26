"use client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import {
  HeroArt,
  ConnectArt,
  RagDiagram,
  PaymentDiagram,
  AgentDiagram,
} from "@/components/illustrations";
import { Input, Textarea } from "@/components/ui/Input";
import { Kbd } from "@/components/ui/Kbd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tooltip } from "@/components/ui/Tooltip";
import { Dialog } from "@/components/ui/Dialog";
import { Magnetic } from "@/components/motion/Magnetic";
import { useState } from "react";

const swatches = [
  ["canvas", "--color-canvas"], ["ink", "--color-ink"], ["muted", "--color-muted"],
  ["accent", "--color-accent"], ["accent-2", "--color-accent-2"], ["card", "--color-card"],
  ["feature", "--color-feature"], ["ok", "--color-ok"], ["warn", "--color-warn"],
];

export default function StyleGuide() {
  const [dialogOpen, setDialogOpen] = useState(false);
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
        <h2 className="mb-4 text-xl font-semibold">Typography: Space Grotesk / JetBrains Mono</h2>
        <div className="space-y-2">
          <p style={{ fontSize: "clamp(2.5rem,7vw,5.5rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 0.95 }}>Ayinla Samuel</p>
          <p className="text-3xl font-semibold">Heading 2: section title</p>
          <p className="text-xl font-medium">Heading 3: card title</p>
          <p className="text-base text-muted">Body: a full-stack engineer building for the web and everything under it.</p>
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

      {/* Form controls & primitives */}
      <section className="mb-14">
        <h2 className="mb-4 text-xl font-semibold">Form controls & primitives</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input placeholder="Input: your name" />
          <Input type="email" placeholder="Input: email" />
        </div>
        <Textarea className="mt-4" placeholder="Textarea: your message" />
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span className="text-sm text-muted">Command palette:</span>
          <span className="flex items-center gap-1"><Kbd>⌘</Kbd><Kbd>K</Kbd></span>
          <Tooltip label="This is a tooltip">
            <Button variant="outline" size="sm">Hover / focus me</Button>
          </Tooltip>
          <Button variant="accent" size="sm" onClick={() => setDialogOpen(true)}>
            Open dialog
          </Button>
          <Magnetic>
            <span className="rounded-full border border-line px-4 py-2 text-sm">Magnetic</span>
          </Magnetic>
        </div>
        <div className="mt-8">
          <SectionHeading kicker="Section heading" id="sg-heading">
            A consistent heading with a kicker
          </SectionHeading>
        </div>
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Example dialog">
          <p className="text-sm text-muted">
            Native dialog: Esc closes, backdrop click closes, focus is trapped. Both themes.
          </p>
          <div className="mt-4 flex justify-end">
            <Button size="sm" onClick={() => setDialogOpen(false)}>Got it</Button>
          </div>
        </Dialog>
      </section>

      {/* Cards */}
      <section className="mb-14">
        <h2 className="mb-4 text-xl font-semibold">Cards</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card feature>
            <p className="font-mono text-xs uppercase tracking-widest opacity-70">Feature card</p>
            <h3 className="mt-2 text-2xl font-bold">Prediction Engine</h3>
            <p className="mt-2 opacity-80">The anchor card: black on light, indigo on dark.</p>
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
        <Reveal><Card><p>Reveal: fades up when it enters the viewport.</p></Card></Reveal>
        <Stagger className="mt-4 grid gap-3 sm:grid-cols-3">
          {["One", "Two", "Three"].map((t) => (
            <StaggerItem key={t}><Card><p className="text-center">{t}</p></Card></StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Illustrations & diagrams: theme from tokens (currentColor + accent) */}
      <section className="mb-14">
        <h2 className="mb-1 text-xl font-semibold">Illustrations & engineering diagrams</h2>
        <p className="mb-6 text-sm text-muted">
          One SVG each, no baked colors. Toggle the theme above: strokes follow ink, accents
          follow the accent token, panels follow the card token.
        </p>

        <h3 className="mb-3 mt-6 font-mono text-xs uppercase tracking-widest text-muted">Friendly art</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card><div className="text-ink"><HeroArt className="h-48 w-full" /></div>
            <p className="mt-2 text-center text-sm text-muted">Hero</p></Card>
          <Card><div className="text-ink"><ConnectArt className="h-48 w-full" /></div>
            <p className="mt-2 text-center text-sm text-muted">Connect / contact</p></Card>
        </div>

        <h3 className="mb-3 mt-8 font-mono text-xs uppercase tracking-widest text-muted">Engineering diagrams</h3>
        <div className="space-y-4">
          <Card><div className="text-ink overflow-x-auto"><RagDiagram className="h-28 min-w-[680px]" /></div>
            <p className="mt-2 text-sm text-muted">RAG pipeline</p></Card>
          <Card><div className="text-ink overflow-x-auto"><PaymentDiagram className="h-44 min-w-[560px]" /></div>
            <p className="mt-2 text-sm text-muted">Payment lifecycle</p></Card>
          <Card><div className="text-ink overflow-x-auto"><AgentDiagram className="h-48 min-w-[560px]" /></div>
            <p className="mt-2 text-sm text-muted">Agent workflow</p></Card>
        </div>
      </section>
    </main>
  );
}

