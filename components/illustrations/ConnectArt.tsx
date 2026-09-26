/**
 * Friendly connect/contact illustration: two figures meeting in a high-five,
 * our own take on the "let's talk" moment. Themes automatically via
 * currentColor (inherits text-ink); the spark at the point of contact uses the
 * accent token via a text-accent wrapper. Decorative, so aria-hidden.
 */
export function ConnectArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 220"
      fill="none"
      role="img"
      aria-hidden="true"
      className={className}
    >
      {/* ground */}
      <line
        x1="30"
        y1="196"
        x2="270"
        y2="196"
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* left figure */}
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="78" cy="64" r="18" />
        <path d="M78 82 L78 138" />
        {/* raised hand toward center */}
        <path d="M78 98 L130 82" />
        {/* other arm */}
        <path d="M78 100 L58 128" />
        <path d="M78 138 L62 190" />
        <path d="M78 138 L94 190" />
      </g>

      {/* right figure */}
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="222" cy="64" r="18" />
        <path d="M222 82 L222 138" />
        {/* raised hand toward center */}
        <path d="M222 98 L170 82" />
        {/* other arm */}
        <path d="M222 100 L242 128" />
        <path d="M222 138 L206 190" />
        <path d="M222 138 L238 190" />
      </g>

      {/* high-five spark at contact point (accent) */}
      <g className="text-accent">
        <circle cx="150" cy="78" r="6" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="150" y1="58" x2="150" y2="48" />
          <line x1="168" y1="66" x2="176" y2="60" />
          <line x1="132" y1="66" x2="124" y2="60" />
          <line x1="164" y1="90" x2="172" y2="96" />
          <line x1="136" y1="90" x2="128" y2="96" />
        </g>
      </g>
    </svg>
  );
}
