import { DiagramFrame, DiagramNode, DiagramArrow } from "./diagram-parts";

/**
 * Agent workflow diagram: user goal -> planner (LLM) -> tool calls -> observe
 * -> loop back until done -> final answer. The plan/act/observe loop is the
 * accent-lit heart of agentic tool use. Themes automatically.
 */
export function AgentDiagram({ className }: { className?: string }) {
  return (
    <DiagramFrame
      viewBox="0 0 620 200"
      title="Agent workflow: plan, call tools, observe, repeat until done"
      className={className}
    >
      <DiagramNode x={8} y={80} label="User goal" />
      <DiagramArrow x1={116} y1={100} x2={132} y2={100} />
      <DiagramNode x={132} y={80} w={116} label="Planner" sub="LLM" accent />

      {/* out to tools */}
      <DiagramArrow x1={248} y1={100} x2={288} y2={100} accent />
      <DiagramNode x={288} y={80} w={116} label="Tool call" sub="function" />

      {/* tools -> observe */}
      <DiagramArrow x1={404} y1={100} x2={444} y2={100} />
      <DiagramNode x={444} y={80} label="Observe" sub="result" />

      {/* loop: observe back up to planner */}
      <DiagramArrow x1={496} y1={78} x2={190} y2={78} dashed accent />
      <text
        x={340}
        y={54}
        textAnchor="middle"
        fill="currentColor"
        fillOpacity="0.55"
        className="font-mono text-accent"
        fontSize="9"
      >
        loop until done
      </text>

      {/* planner -> final answer when done */}
      <DiagramArrow x1={190} y1={120} x2={190} y2={158} />
      <DiagramNode x={132} y={158} w={116} label="Final answer" />
    </DiagramFrame>
  );
}
