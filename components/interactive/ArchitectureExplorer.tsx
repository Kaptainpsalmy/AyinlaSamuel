"use client";
import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { RagDiagram, PaymentDiagram, AgentDiagram } from "@/components/illustrations";

/**
 * Interactive walk-through of the architectures behind Samuel's real systems.
 * Pick a system, then step through its stages; each stage explains what it does
 * and links the project it came from. The static diagram sits above as the map.
 * Progressive: the diagram alone is meaningful with JS off.
 *
 * Stage names match the English labels drawn in the diagrams, and the stage
 * explanations are technical content, so both stay English. `title` is a
 * message key under arch.system.
 */
type Stage = { name: string; detail: string };
type System = {
  id: string;
  title: "rag" | "payment" | "agent";
  Diagram: React.ComponentType<{ className?: string }>;
  h: string;
  project: { slug: string; name: string };
  stages: Stage[];
};

const SYSTEMS: System[] = [
  {
    id: "rag",
    title: "rag",
    Diagram: RagDiagram,
    h: "h-28",
    project: { slug: "whatsapp-rag-bot", name: "Sabre WhatsApp Helpdesk Bot" },
    stages: [
      { name: "Documents", detail: "Source docs (the Sabre format guide) are chunked and stored." },
      { name: "Embed", detail: "Each chunk is embedded once, offline, so there is no per-query cost." },
      { name: "Vector index", detail: "Chunks + vectors live in a pgvector store for similarity search." },
      { name: "Retrieve", detail: "Hybrid retrieval: vector similarity plus keyword, re-ranked for the top-k." },
      { name: "LLM", detail: "The model answers using ONLY the retrieved context, via Groq." },
      { name: "Answer + Sources", detail: "The reply cites the exact source section, or hands off when unsure." },
    ],
  },
  {
    id: "payment",
    title: "payment",
    Diagram: PaymentDiagram,
    h: "h-44",
    project: { slug: "iasg", name: "IASG Cooperative" },
    stages: [
      { name: "Client", detail: "A request comes in to move money (contribution, loan repayment)." },
      { name: "API gateway", detail: "An idempotency key makes a retried request safe: no double charge." },
      { name: "Authorize", detail: "Funds are authorized before anything is captured." },
      { name: "Capture", detail: "The authorized amount is captured and recorded." },
      { name: "Ledger", detail: "An append-only ledger is the source of truth for balances." },
      { name: "Webhook", detail: "Provider webhooks are signature-verified before they are trusted." },
    ],
  },
  {
    id: "agent",
    title: "agent",
    Diagram: AgentDiagram,
    h: "h-48",
    project: { slug: "smart-travel-agent", name: "Smart Travel Agent" },
    stages: [
      { name: "User goal", detail: "A high-level task, e.g. find and monitor a flight." },
      { name: "Planner", detail: "The LLM decides the next step and which tool to call." },
      { name: "Tool call", detail: "A concrete function runs: flight search, price check, document Q&A." },
      { name: "Observe", detail: "The tool result is inspected; the agent reasons about mismatches." },
      { name: "Loop", detail: "Plan, act, observe repeats until the goal is met." },
      { name: "Final answer", detail: "The agent returns the result once it is confident." },
    ],
  },
];

export function ArchitectureExplorer() {
  const t = useTranslations("arch");
  const [sysId, setSysId] = useState(SYSTEMS[0].id);
  const [stageIdx, setStageIdx] = useState(0);
  const system = SYSTEMS.find((s) => s.id === sysId) ?? SYSTEMS[0];
  const stage = system.stages[stageIdx];

  return (
    <div className="flex flex-col gap-5">
      {/* system picker */}
      <div className="flex flex-wrap gap-2" role="group" aria-label={t("pickSystem")}>
        {SYSTEMS.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setSysId(s.id);
              setStageIdx(0);
            }}
            aria-pressed={s.id === sysId}
            className={
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors " +
              (s.id === sysId ? "border-accent bg-accent text-white" : "border-line text-muted hover:text-ink")
            }
          >
            {t(`system.${s.title}`)}
          </button>
        ))}
      </div>

      {/* the diagram (the map) */}
      <figure className="overflow-x-auto rounded-xl border border-line bg-card p-4 text-ink">
        <system.Diagram className={`${system.h} min-w-[560px]`} />
      </figure>

      {/* stage stepper */}
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={t("stages")}>
        {system.stages.map((s, i) => (
          <button
            key={s.name}
            onClick={() => setStageIdx(i)}
            aria-pressed={i === stageIdx}
            className={
              "rounded-lg border px-2.5 py-1.5 text-xs transition-colors " +
              (i === stageIdx ? "border-accent bg-card text-ink" : "border-line text-muted hover:text-ink")
            }
          >
            {i + 1}. {s.name}
          </button>
        ))}
      </div>

      {/* stage detail: announced to screen readers as the stage changes */}
      <div className="rounded-xl border border-line bg-card/50 p-4" aria-live="polite">
        <p className="text-sm font-semibold">{stage.name}</p>
        <p lang="en" className="mt-1 text-sm text-muted">{stage.detail}</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <Link
            href={`/projects/${system.project.slug}`}
            className="inline-flex items-center gap-1 text-sm text-accent-2 hover:underline"
          >
            {t("seeItIn", { name: system.project.name })} <ArrowUpRight size={14} />
          </Link>
          {stageIdx < system.stages.length - 1 && (
            <button
              onClick={() => setStageIdx((i) => i + 1)}
              className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
            >
              {t("nextStage")} <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
