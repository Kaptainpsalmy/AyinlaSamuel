/**
 * Friendly hero illustration: a stylized engineer figure beside a server/API
 * stack with a small data spark. Themes automatically because every stroke uses
 * currentColor (inherits text-ink) and accents use the accent token via
 * text-accent on a wrapping element. No baked-in hex, so one file serves both
 * light and dark. Decorative, so aria-hidden.
 */
export function HeroArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 240"
      fill="none"
      role="img"
      aria-hidden="true"
      className={className}
    >
      {/* soft ground line */}
      <line
        x1="24"
        y1="208"
        x2="296"
        y2="208"
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* server / API stack */}
      <g stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round">
        <rect x="196" y="96" width="92" height="34" rx="4" />
        <rect x="196" y="136" width="92" height="34" rx="4" />
        <rect x="196" y="176" width="92" height="34" rx="4" />
      </g>
      {/* status dots on the stack, accent-colored */}
      <g className="text-accent">
        <circle cx="210" cy="113" r="4" fill="currentColor" />
        <circle cx="210" cy="153" r="4" fill="currentColor" />
        <circle cx="210" cy="193" r="4" fill="currentColor" />
      </g>
      {/* rack lines */}
      <g stroke="currentColor" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round">
        <line x1="226" y1="113" x2="276" y2="113" />
        <line x1="226" y1="153" x2="276" y2="153" />
        <line x1="226" y1="193" x2="276" y2="193" />
      </g>

      {/* engineer figure */}
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* head */}
        <circle cx="86" cy="70" r="20" fill="none" />
        {/* body */}
        <path d="M86 90 L86 150" />
        {/* arms: one raised toward the data spark */}
        <path d="M86 108 L58 132" />
        <path d="M86 108 L124 92" />
        {/* legs */}
        <path d="M86 150 L66 200" />
        <path d="M86 150 L106 200" />
      </g>

      {/* data spark traveling from engineer to server (accent) */}
      <g className="text-accent">
        <path
          d="M132 88 C160 78 172 96 196 104"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="2 8"
        />
        <circle cx="150" cy="82" r="3.5" fill="currentColor" />
        <path
          d="M118 44 l4 9 9 4 -9 4 -4 9 -4 -9 -9 -4 9 -4 z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}
