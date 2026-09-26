import { getTranslations } from "next-intl/server";
import { RagDiagram, PaymentDiagram, AgentDiagram } from "@/components/illustrations";

/**
 * Renders the architecture diagram that genuinely matches a given project, or
 * nothing when none fits. Deliberately conservative: a diagram only shows where
 * it describes the real system (RAG bots, the agent, the payment platforms), so
 * the figures read as accurate rather than decorative. Captions are message keys.
 */
const bySlug: Record<string, { Diagram: React.ComponentType<{ className?: string }>; caption: string; h: string }> = {
  "whatsapp-rag-bot": { Diagram: RagDiagram, caption: "rag", h: "h-28" },
  "lautech-chatbot": { Diagram: RagDiagram, caption: "ragChatbot", h: "h-28" },
  "smart-travel-agent": { Diagram: AgentDiagram, caption: "agent", h: "h-48" },
  iasg: { Diagram: PaymentDiagram, caption: "payment", h: "h-44" },
  bemahub: { Diagram: PaymentDiagram, caption: "payment", h: "h-44" },
};

export async function ProjectDiagram({ slug }: { slug: string }) {
  const entry = bySlug[slug];
  if (!entry) return null;
  const t = await getTranslations("diagram");
  const { Diagram, caption, h } = entry;
  return (
    <figure className="mt-10 rounded-[22px] border border-line bg-card p-5">
      <div className="overflow-x-auto text-ink">
        <Diagram className={`${h} min-w-[560px]`} />
      </div>
      <figcaption className="mt-3 font-mono text-xs text-muted">{t(caption)}</figcaption>
    </figure>
  );
}
