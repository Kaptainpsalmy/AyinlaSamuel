"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Play, Loader2, CheckCircle2, XCircle, BookOpen } from "lucide-react";

/**
 * A live console that hits Samuel's real FastAPI endpoints and shows the actual
 * JSON, status, and latency. This is the "you can inspect how it works" proof:
 * the backend behind the site is real and public. Endpoints degrade gracefully,
 * so this works even without production keys. Responses are shown raw (English),
 * exactly as the API returns them.
 */
// `label` is a message key under api.endpoint.
type Endpoint = { method: "GET" | "POST"; path: string; label: string; body?: unknown };

const ENDPOINTS: Endpoint[] = [
  { method: "GET", path: "/api/py/health", label: "health" },
  { method: "GET", path: "/api/py/now", label: "now" },
  { method: "GET", path: "/api/py/github/contributions", label: "contributions" },
  { method: "GET", path: "/api/py/projects/sicklesense/views", label: "views" },
  {
    method: "POST",
    path: "/api/py/chat",
    label: "chat",
    body: { message: "What did you build at Sabre?" },
  },
];

type Result = {
  status: number | null;
  ms: number;
  ok: boolean;
  text: string;
};

export function ApiPlayground() {
  const t = useTranslations("api");
  const [active, setActive] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  async function run(ep: Endpoint) {
    setActive(ep.path);
    setBusy(ep.path);
    setResult(null);
    const started = performance.now();
    try {
      const res = await fetch(ep.path, {
        method: ep.method,
        headers: ep.body ? { "Content-Type": "application/json" } : undefined,
        body: ep.body ? JSON.stringify(ep.body) : undefined,
      });
      let text: string;
      const ct = res.headers.get("content-type") ?? "";
      if (ct.includes("application/json")) {
        text = JSON.stringify(await res.json(), null, 2);
      } else if (ct.includes("text/event-stream")) {
        // chat streams SSE: collect the streamed text into one answer
        const reader = res.body?.getReader();
        const dec = new TextDecoder();
        let acc = "";
        let buf = "";
        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          const lines = buf.split("\n\n");
          buf = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const b = line.slice(6);
            if (b.trim() === "[DONE]") continue;
            try {
              const o = JSON.parse(b);
              if (o.text) acc += o.text;
              if (o.sources) acc += `\n\n[sources: ${o.sources.join(", ")}]`;
            } catch {}
          }
        }
        text = acc || t("noContent");
      } else {
        text = t("binary", { type: ct || "binary", size: res.headers.get("content-length") ?? "?" });
      }
      setResult({ status: res.status, ok: res.ok, ms: Math.round(performance.now() - started), text });
    } catch {
      setResult({ status: null, ok: false, ms: Math.round(performance.now() - started), text: t("failed") });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,14rem)_1fr]">
      {/* endpoint list */}
      <div className="flex flex-col gap-2">
        {ENDPOINTS.map((ep) => (
          <button
            key={ep.path}
            onClick={() => run(ep)}
            disabled={busy === ep.path}
            aria-pressed={active === ep.path}
            className={
              "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors " +
              (active === ep.path ? "border-accent bg-card" : "border-line hover:border-accent/50")
            }
          >
            <span className="font-mono text-[10px] font-bold text-accent-2">{ep.method}</span>
            <span className="min-w-0 flex-1 truncate">{t(`endpoint.${ep.label}`)}</span>
            {busy === ep.path ? <Loader2 size={14} className="animate-spin text-muted" /> : <Play size={13} className="text-muted" />}
          </button>
        ))}
        <a
          href="/api/py/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex items-center gap-1.5 rounded-xl border border-line px-3 py-2.5 text-sm text-muted transition-colors hover:text-accent-2"
        >
          <BookOpen size={14} /> {t("openDocs")}
        </a>
      </div>

      {/* response */}
      <div className="min-h-[16rem] overflow-hidden rounded-xl border border-line bg-[#0e0e10]">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 font-mono text-xs text-white/70">
          <span>{active ?? t("response")}</span>
          {result && (
            <span className="flex items-center gap-1.5">
              {result.ok ? (
                <CheckCircle2 size={13} className="text-[#3ddc84]" />
              ) : (
                <XCircle size={13} className="text-[#ff6584]" />
              )}
              {result.status ?? "ERR"} · {result.ms}ms
            </span>
          )}
        </div>
        <pre aria-live="polite" className="max-h-[22rem] overflow-auto p-3 font-mono text-xs leading-relaxed text-[#e2e2e6]">
          {result ? result.text : t("pick")}
        </pre>
      </div>
    </div>
  );
}
