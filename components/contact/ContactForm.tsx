"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, Loader2, Check } from "lucide-react";
import { site } from "@/content/site";
import { toast } from "@/components/common/Toast";

type State = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const t = useTranslations("contactForm");
  const [state, setState] = useState<State>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(data: Record<string, string>) {
    const e: Record<string, string> = {};
    if (!data.name?.trim()) e.name = t("errName");
    if (!data.email?.trim()) e.email = t("errEmailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = t("errEmailInvalid");
    if (!data.message?.trim() || data.message.trim().length < 10) e.message = t("errMessage");
    return e;
  }

  function openMailApp(data: Record<string, string>) {
    const subject = encodeURIComponent(data.subject || t("defaultSubject"));
    const body = encodeURIComponent(`${data.message}\n\n${t("from")}: ${data.name} (${data.email})`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
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
      // The API answers 200 even when it refuses: read the status it reports.
      const body = (await res.json().catch(() => ({}))) as { status?: string };
      if (body.status === "rate_limited") {
        setState("error");
        toast(t("rateLimited"));
        return;
      }
      setState("sent");
      toast(t("sentToast"));
      form.reset();
    } catch {
      // backend unreachable: fall back to the visitor's email app
      openMailApp(data);
      setState("idle");
      toast(t("openingEmail"));
    }
  }

  const field = "w-full rounded-xl border border-line bg-card px-4 py-3 text-sm text-ink outline-none placeholder:text-muted focus:border-accent";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {/* honeypot (hidden from humans) */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm text-muted">{t("name")}</label>
          <input id="name" name="name" autoComplete="name" className={field} placeholder={t("namePlaceholder")}
            aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
          {errors.name && <p id="name-error" className="mt-1 text-xs text-warn-ink">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-muted">{t("email")}</label>
          <input id="email" name="email" type="email" autoComplete="email" className={field} placeholder="you@example.com"
            aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
          {errors.email && <p id="email-error" className="mt-1 text-xs text-warn-ink">{errors.email}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm text-muted">{t("subject")}</label>
        <input id="subject" name="subject" className={field} placeholder={t("subjectPlaceholder")} />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm text-muted">{t("message")}</label>
        <textarea id="message" name="message" rows={5} className={field} placeholder={t("messagePlaceholder")}
          aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} />
        {errors.message && <p id="message-error" className="mt-1 text-xs text-warn-ink">{errors.message}</p>}
      </div>
      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-canvas transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {state === "sending" ? <Loader2 size={16} className="animate-spin" /> : state === "sent" ? <Check size={16} /> : <Send size={16} />}
        {state === "sending" ? t("sending") : state === "sent" ? t("sent") : t("send")}
      </button>
    </form>
  );
}
