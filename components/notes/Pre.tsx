"use client";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Copy, Check } from "lucide-react";

/**
 * <pre> override for MDX code blocks: styled + a working copy button. The
 * button fades in on hover, but stays visible on keyboard focus and on touch
 * screens (no hover there), so every visitor can reach it.
 */
export function Pre(props: React.HTMLAttributes<HTMLPreElement>) {
  const t = useTranslations("note");
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text = ref.current?.textContent ?? "";
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  }

  return (
    <div className="group relative">
      <button onClick={copy} aria-label={copied ? t("copied") : t("copyCode")}
        className="absolute right-3 top-3 z-10 rounded-md border border-line bg-canvas/80 p-1.5 text-muted opacity-0 backdrop-blur transition-opacity hover:text-ink focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
        {copied ? <Check size={14} className="text-ok" /> : <Copy size={14} />}
      </button>
      <pre ref={ref} {...props} className={"overflow-x-auto rounded-xl border border-line bg-card p-4 text-sm " + (props.className ?? "")} />
    </div>
  );
}
