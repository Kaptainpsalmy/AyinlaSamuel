"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Sparkles, X, Send, Loader2, ArrowUpRight, BookOpen } from "lucide-react";

type Msg = { role: "user" | "assistant"; text: string; sources?: string[] };

// Suggested prompts stay English: the assistant's knowledge base is English, so
// English questions retrieve best. The surrounding UI is translated.
const suggestions = [
  "What is your strongest backend project?",
  "Tell me about your RAG work",
  "What did you build at Sabre?",
];

/**
 * Turn a structured source id (project:slug, note:slug, bio, experience) into a
 * readable label and, where one exists, a link to the page it came from. This
 * is the citation trail: every answer points back to the real content.
 */
function sourceMeta(src: string, t: (k: "about" | "experience") => string): { label: string; href?: string } {
  if (src.startsWith("project:")) {
    const slug = src.slice(8);
    return { label: slug.replace(/-/g, " "), href: `/projects/${slug}` };
  }
  if (src.startsWith("note:")) {
    const slug = src.slice(5);
    return { label: slug.replace(/-/g, " "), href: `/notes/${slug}` };
  }
  if (src === "bio") return { label: t("about"), href: "/about" };
  if (src === "experience") return { label: t("experience"), href: "/experience" };
  return { label: src };
}

export function AskAI() {
  const t = useTranslations("ai");
  const tc = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // open from the command palette; suppress its placeholder toast
  useEffect(() => {
    const onOpen = (e: Event) => { e.preventDefault(); setOpen(true); };
    document.addEventListener("open-ai", onOpen);
    return () => document.removeEventListener("open-ai", onOpen);
  }, []);

  // Focus the input on open; Escape closes.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  async function ask(question: string) {
    if (!question.trim() || busy) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: question }, { role: "assistant", text: "" }]);
    setBusy(true);

    // Accumulate the streamed answer in local variables and push the whole value
    // each time. The state updater stays a pure "set", so React Strict Mode
    // double-invoking it cannot double-append tokens.
    let acc = "";
    let srcs: string[] | undefined;
    const flush = () =>
      setMsgs((m) => {
        const copy = [...m];
        const i = copy.length - 1;
        copy[i] = { ...copy[i], text: acc, sources: srcs };
        return copy;
      });

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
            if (obj.text) acc += obj.text;
            if (obj.sources) srcs = obj.sources;
            flush();
          } catch {}
        }
      }
    } catch {
      acc = acc || t("error");
      flush();
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* floating trigger */}
      <button
        onClick={() => setOpen(true)}
        aria-label={t("open")}
        className="fixed bottom-24 right-6 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-lg transition-transform hover:scale-105 lg:bottom-6"
      >
        <Sparkles size={20} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true" aria-label={t("dialogLabel")}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative z-10 flex h-[70vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-line bg-canvas shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="flex items-center gap-2 font-medium"><Sparkles size={16} className="text-accent-2" /> {t("title")}</span>
              <button onClick={() => setOpen(false)} aria-label={tc("close")}><X size={18} className="text-muted hover:text-ink" /></button>
            </div>

            {/* No aria-live here: streamed tokens would make a screen reader re-read
                the answer on every update. */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {msgs.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted">{t("intro")}</p>
                  <div className="flex flex-col gap-2">
                    {suggestions.map((s) => (
                      <button key={s} lang="en" onClick={() => ask(s)} className="rounded-lg border border-line px-3 py-2 text-left text-sm text-muted hover:border-accent hover:text-ink">{s}</button>
                    ))}
                  </div>
                </div>
              )}
              {msgs.map((m, i) => (
                <div key={i} className={m.role === "user" ? "text-right" : ""}>
                  <div className={"inline-block max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-left text-sm " + (m.role === "user" ? "bg-ink text-canvas" : "bg-card text-ink")}>
                    {m.text || <Loader2 size={14} className="animate-spin" aria-label={t("thinking")} />}
                  </div>
                  {m.role === "assistant" && m.sources && m.sources.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">{t("sources")}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {m.sources.map((src) => {
                          const { label, href } = sourceMeta(src, t);
                          const cls =
                            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] capitalize";
                          return href ? (
                            <Link
                              key={src}
                              href={href}
                              onClick={() => setOpen(false)}
                              className={cls + " border-line text-accent-2 hover:border-accent"}
                            >
                              {label} <ArrowUpRight size={11} />
                            </Link>
                          ) : (
                            <span key={src} className={cls + " border-line text-muted"}>{label}</span>
                          );
                        })}
                      </div>
                      <a
                        href="/api/py/docs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-[10px] text-muted transition-colors hover:text-accent-2"
                      >
                        <BookOpen size={11} /> {t("grounded")}
                      </a>
                    </div>
                  )}
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="flex gap-2 border-t border-line p-3">
              <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("placeholder")} aria-label={t("placeholder")} disabled={busy}
                className="flex-1 rounded-full border border-line bg-card px-4 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-accent" />
              <button type="submit" disabled={busy || !input.trim()} aria-label={t("send")}
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
