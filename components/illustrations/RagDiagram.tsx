import { DiagramFrame, DiagramNode, DiagramArrow } from "./diagram-parts";

/**
 * RAG pipeline diagram: documents -> embed -> vector store -> retrieve -> LLM
 * -> answer with sources. The final "Answer + Sources" node is accent-lit
 * because sourced answers are the point of the system. Themes automatically.
 */
export function RagDiagram({ className }: { className?: string }) {
  return (
    <DiagramFrame
      viewBox="0 0 760 130"
      title="RAG pipeline: documents to a sourced answer"
      className={className}
    >
      <DiagramNode x={8} y={45} label="Documents" sub="case studies" />
      <DiagramArrow x1={116} y1={65} x2={132} y2={65} />
      <DiagramNode x={132} y={45} label="Embed" sub="hosted API" />
      <DiagramArrow x1={240} y1={65} x2={256} y2={65} />
      <DiagramNode x={256} y={45} label="Vector index" sub="index.json" />
      <DiagramArrow x1={364} y1={65} x2={380} y2={65} />
      <DiagramNode x={380} y={45} label="Retrieve" sub="top-k" />
      <DiagramArrow x1={488} y1={65} x2={504} y2={65} />
      <DiagramNode x={504} y={45} label="LLM" sub="Groq" />
      <DiagramArrow x1={612} y1={65} x2={628} y2={65} accent />
      <DiagramNode x={628} y={45} w={124} label="Answer + Sources" sub="cited" accent />
    </DiagramFrame>
  );
}
