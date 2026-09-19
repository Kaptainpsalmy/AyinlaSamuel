"use client";
import { useState } from "react";
import { Send, Loader2, Check } from "lucide-react";
import { site } from "@/content/site";
import { toast } from "@/components/common/Toast";

type State = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(data: Record<string, string>) {
    const e: Record<string, string> = {};
    if (!data.name?.trim()) e.name = "Your name is required.";
    if (!data.email?.trim()) e.email = "Your email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "That email does not look right.";
    if (!data.message?.trim() || data.message.trim().length < 10) e.message = "Please write at least 10 characters.";
    return e;
  }

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const fd = new FormData(form);
    const data = Object.fromEntries(fd) as Record<string, string>;

    // honeypot: if filled, silently succeed (bot)
    if (data.company) { setState("sent"); return; }

    const e = validate(data);
    setErrors(e);
    if (Object.keys(e).length) return;

    setState("sending");
    try {
      const res = await fetch("/api/py/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, subject: data.subject, message: data.message }),
      });
      if (!res.ok) throw new Error("bad status");
      setState("sent");
      toast("Message sent. I will get back to you.");
      form.reset();
    } catch {
      // backend not up yet (Phase 6) or offline: fall back to mailto
      const subject = encodeURIComponent(data.subject || "Portfolio contact");
      const body = encodeURIComponent(`${data.message}\n\nFrom: ${data.name} (${data.email})`);
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      setState("idle");
      toast("Opening your email app...");
    }
  }

  const field = "w-full rounded-xl border border-line bg-card px-4 py-3 text-sm text-ink outline-none placeholder:text-muted focus:border-accent";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {/* honeypot (hidden from humans) */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm text-muted">Name</label>
          <input id="name" name="name" className={field} placeholder="Your name" aria-invalid={!!errors.name} />
          {errors.name && <p className="mt-1 text-xs text-warn">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-muted">Email</label>
          <input id="email" name="email" type="email" className={field} placeholder="you@example.com" aria-invalid={!!errors.email} />
          {errors.email && <p className="mt-1 text-xs text-warn">{errors.email}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm text-muted">Subject</label>
        <input id="subject" name="subject" className={field} placeholder="What is this about?" />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm text-muted">Message</label>
        <textarea id="message" name="message" rows={5} className={field} placeholder="Tell me about your project or role." aria-invalid={!!errors.message} />
        {errors.message && <p className="mt-1 text-xs text-warn">{errors.message}</p>}
      </div>
      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-canvas transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {state === "sending" ? <Loader2 size={16} className="animate-spin" /> : state === "sent" ? <Check size={16} /> : <Send size={16} />}
        {state === "sending" ? "Sending..." : state === "sent" ? "Sent" : "Send message"}
      </button>
    </form>
  );
}
