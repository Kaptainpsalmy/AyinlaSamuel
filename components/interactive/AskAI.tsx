"use client";
import { useEffect, useRef, useState } from "react";
import { Sparkles, X, Send, Loader2 } from "lucide-react";

type Msg = { role: "user" | "assistant"; text: string; sources?: string[] };

const suggestions = [
  "What is your strongest backend project?",
  "Tell me about your RAG work",
  "What did you build at Sabre?",
];

export function AskAI() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // open from the command palette; suppress its placeholder toast
  useEffect(() => {
    const onOpen = (e: Event) => { e.preventDefault(); setOpen(true); };
    document.addEventListener("open-ai", onOpen);
    return () => document.removeEventListener("open-ai", onOpen);
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  async function ask(question: string) {
    if (!question.trim() || busy) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: question }, { role: "assistant", text: "" }]);
    setBusy(true);
    try {
      const res = await fetch("/api/py/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });
      if (!res.body) throw new Error();
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const body = line.slice(6);
          if (body.trim() === "[DONE]") continue;
          try {
            const obj = JSON.parse(body);
            setMsgs((m) => {
              const copy = [...m];
              const i = copy.length - 1;
              const last = { ...copy[i] };
              if (obj.text) last.text = last.text + obj.text;
              if (obj.sources) last.sources = obj.sources;
              copy[i] = last;
              return copy;
            });
          } catch {}
        }
      }
    } catch {
      setMsgs((m) => { const c = [...m]; c[c.length - 1].text = "Sorry, something went wrong."; return c; });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* floating trigger */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Ask the AI assistant"
        className="fixed bottom-6 right-6 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-lg transition-transform hover:scale-105"
      >
        <Sparkles size={20} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true" aria-label="AI assistant">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative z-10 flex h-[70vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-line bg-canvas shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="flex items-center gap-2 font-medium"><Sparkles size={16} className="text-accent-2" /> Ask about my work</span>
              <button onClick={() => setOpen(false)} aria-label="Close"><X size={18} className="text-muted hover:text-ink" /></button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {msgs.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted">Ask me anything about Samuel&apos;s projects, experience, or skills. Answers are grounded in his real work.</p>
                  <div className="flex flex-col gap-2">
                    {suggestions.map((s) => (
                      <button key={s} onClick={() => ask(s)} className="rounded-lg border border-line px-3 py-2 text-left text-sm text-muted hover:border-accent hover:text-ink">{s}</button>
                    ))}
                  </div>
                </div>
              )}
              {msgs.map((m, i) => (
                <div key={i} className={m.role === "user" ? "text-right" : ""}>
                  <div className={"inline-block max-w-[85%] rounded-2xl px-4 py-2.5 text-sm " + (m.role === "user" ? "bg-ink text-canvas" : "bg-card text-ink")}>
                    {m.text || <Loader2 size={14} className="animate-spin" />}
                  </div>
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {m.sources.map((src) => <span key={src} className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-muted">{src}</span>)}
                    </div>
                  )}
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="flex gap-2 border-t border-line p-3">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about my work..." disabled={busy}
                className="flex-1 rounded-full border border-line bg-card px-4 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-accent" />
              <button type="submit" disabled={busy || !input.trim()} aria-label="Send"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-canvas disabled:opacity-50">
                {busy ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
