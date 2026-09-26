import { DiagramFrame, DiagramNode, DiagramArrow } from "./diagram-parts";

/**
 * Payment lifecycle diagram: client -> API (idempotency key) -> authorize ->
 * capture -> ledger, with a webhook verifying back to the API. The idempotency
 * gate is accent-lit because it is the engineering claim. Themes automatically.
 */
export function PaymentDiagram({ className }: { className?: string }) {
  return (
    <DiagramFrame
      viewBox="0 0 620 190"
      title="Payment lifecycle: authorize, capture, ledger, with webhook verification"
      className={className}
    >
      {/* top row */}
      <DiagramNode x={8} y={20} label="Client" />
      <DiagramArrow x1={116} y1={40} x2={132} y2={40} />
      <DiagramNode x={132} y={20} w={124} label="API gateway" sub="idempotency key" accent />
      <DiagramArrow x1={256} y1={40} x2={272} y2={40} />
      <DiagramNode x={272} y={20} label="Authorize" />
      <DiagramArrow x1={380} y1={40} x2={396} y2={40} />
      <DiagramNode x={396} y={20} label="Capture" />
      <DiagramArrow x1={504} y1={40} x2={520} y2={40} />
      <DiagramNode x={504} y={20} w={108} label="Ledger" sub="append only" />

      {/* webhook return path */}
      <DiagramNode x={272} y={128} w={124} label="Webhook" sub="signature verified" />
      {/* capture -> webhook */}
      <DiagramArrow x1={450} y1={60} x2={396} y2={128} dashed />
      {/* webhook -> api (verify) */}
      <DiagramArrow x1={272} y1={148} x2={190} y2={60} dashed accent />
    </DiagramFrame>
  );
}
