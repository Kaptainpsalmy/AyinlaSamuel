"use client";
import { useRef, useState } from "react";
import { Copy, Check } from "lucide-react";

/** <pre> override for MDX code blocks: styled + a working copy button. */
export function Pre(props: React.HTMLAttributes<HTMLPreElement>) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text = ref.current?.textContent ?? "";
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  }

  return (
    <div className="group relative">
      <button onClick={copy} aria-label="Copy code"
        className="absolute right-3 top-3 z-10 rounded-md border border-line bg-canvas/80 p-1.5 text-muted opacity-0 backdrop-blur transition-opacity hover:text-ink group-hover:opacity-100">
        {copied ? <Check size={14} className="text-ok" /> : <Copy size={14} />}
      </button>
      <pre ref={ref} {...props} className={"overflow-x-auto rounded-xl border border-line bg-card p-4 text-sm " + (props.className ?? "")} />
    </div>
  );
}
