"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Folder, FileText, Briefcase, User, FlaskConical, FileBadge, Mail,
  Copy, Download, Activity, Sparkles,
  SunMoon, Languages, Check, Clock,
  Network, BookOpen, Layers, CircleDot, Play, type LucideIcon,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/common/BrandIcons";
import { site, nav } from "@/content/site";
import { useTheme } from "./ThemeProvider";
import { useRecentCommands } from "@/lib/useRecentCommands";
import { setLocale } from "@/i18n/actions";
import { toast } from "@/components/common/Toast";

const navIcons: Record<string, LucideIcon> = {
  "/projects": Folder, "/notes": FileText, "/experience": Briefcase,
  "/about": User, "/lab": Network, "/play": FlaskConical, "/cv": FileBadge, "/contact": Mail,
};

type Cmd = {
  id: string;
  group: "navigate" | "actions" | "developer" | "social";
  label: string;
  keywords?: string[];
  icon: React.ReactNode;
  run: () => void;
};

const headingCls =
  "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted";

/** `defaultOpen`: LazyCommandMenu mounts this on the first request, already open. */
export function CommandMenu({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const { toggle } = useTheme();
  const t = useTranslations("command");
  const tn = useTranslations("nav");
  const tc = useTranslations("common");
  const { recent, push } = useRecentCommands();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key && e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", onKey);
    const openEvt = () => setOpen(true);
    document.addEventListener("open-command-menu", openEvt);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("open-command-menu", openEvt);
    };
  }, []);

  const go = useCallback((href: string, external?: boolean) => {
    setOpen(false);
    if (external) window.open(href, "_blank", "noopener,noreferrer");
    else router.push(href);
  }, [router]);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      toast(t("emailCopied"));
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast(t("copyFailed", { email: site.email }));
    }
  }, [t]);

  // Single source of truth for all commands (data driven so recents can reference by id).
  const commands = useMemo<Cmd[]>(() => {
    const navCmds: Cmd[] = nav.map((n) => ({
      id: `nav:${n.href}`,
      group: "navigate",
      label: tn(n.href.slice(1) as Parameters<typeof tn>[0]),
      keywords: [n.label.toLowerCase()], // English label stays searchable in any language
      icon: (() => { const I = navIcons[n.href] ?? Folder; return <I size={16} />; })(),
      run: () => go(n.href),
    }));

    const actionCmds: Cmd[] = [
      { id: "copy-email", group: "actions", label: copied ? t("copied") : t("copyEmail"),
        keywords: ["email", "mail", "contact"],
        icon: copied ? <Check size={16} className="text-ok" /> : <Copy size={16} />,
        run: copyEmail },
      { id: "download-cv", group: "actions", label: t("downloadCv"),
        keywords: ["resume", "download"], icon: <Download size={16} />, run: () => go("/cv") },
      { id: "view-now", group: "actions", label: t("viewNow"),
        keywords: ["now", "live", "activity", "status"], icon: <Activity size={16} />,
        run: () => go("/api/py/now", true) },
      { id: "ask-ai", group: "actions", label: t("askAi"),
        keywords: ["ai", "chat", "assistant"], icon: <Sparkles size={16} />,
        run: () => { setOpen(false); const heard = document.dispatchEvent(new CustomEvent("open-ai", { cancelable: true })); if (heard) toast(tc("aiComingSoon")); } },
      // "Match to a job description" is hidden until the matcher exists (it only
      // opened /contact). Its label stays in messages/*.json (command.matchJd).
      { id: "toggle-theme", group: "actions", label: t("toggleTheme"),
        keywords: ["dark", "light", "theme", "mode"], icon: <SunMoon size={16} />, run: () => toggle() },
      { id: "switch-language", group: "actions", label: t("switchLanguage"),
        keywords: ["language", "yoruba", "english", "ede"], icon: <Languages size={16} />,
        run: async () => { const cur = document.documentElement.lang; await setLocale(cur === "yo" ? "en" : "yo"); setOpen(false); router.refresh(); } },
    ];

    // Developer-tool actions (ADDED): make the palette feel like a dev tool.
    const devCmds: Cmd[] = [
      { id: "view-architecture", group: "developer", label: t("viewArchitecture"),
        keywords: ["architecture", "diagram", "rag", "system", "explorer"],
        icon: <Network size={16} />, run: () => go("/lab") },
      { id: "open-api-docs", group: "developer", label: t("openApiDocs"),
        keywords: ["api", "docs", "openapi", "swagger", "fastapi"],
        icon: <BookOpen size={16} />, run: () => go("/api/py/docs", true) },
      { id: "current-stack", group: "developer", label: t("currentStack"),
        keywords: ["stack", "tech", "tools", "skills"],
        icon: <Layers size={16} />, run: () => go("/skills") },
      { id: "availability", group: "developer", label: t("availability"),
        keywords: ["available", "hire", "status", "work"],
        icon: <CircleDot size={16} className={site.available ? "text-ok" : undefined} />,
        run: () => go("/contact") },
      { id: "run-demo", group: "developer", label: t("runDemo"),
        keywords: ["demo", "playground", "try", "live"],
        icon: <Play size={16} />, run: () => go("/play") },
    ];

    const socialCmds: Cmd[] = [
      { id: "github", group: "social", label: t("openGithub"), keywords: ["github", "code"], icon: <GithubIcon size={16} />, run: () => go(site.socials.github, true) },
      { id: "linkedin", group: "social", label: t("openLinkedin"), keywords: ["linkedin"], icon: <LinkedinIcon size={16} />, run: () => go(site.socials.linkedin, true) },
      { id: "twitter", group: "social", label: t("openTwitter"), keywords: ["twitter", "x"], icon: <TwitterIcon size={16} />, run: () => go(site.socials.twitter, true) },
    ];

    return [...navCmds, ...actionCmds, ...devCmds, ...socialCmds];
  }, [t, tn, tc, copied, copyEmail, go, router, toggle]);

  const byId = useMemo(() => Object.fromEntries(commands.map((c) => [c.id, c])), [commands]);
  const recentCmds = recent.map((id) => byId[id]).filter(Boolean) as Cmd[];

  const select = useCallback((c: Cmd) => { push(c.id); c.run(); }, [push]);

  const renderItem = (c: Cmd, keyPrefix = "") => (
    <Command.Item
      key={keyPrefix + c.id}
      value={c.label + " " + (c.keywords ?? []).join(" ")}
      keywords={c.keywords}
      onSelect={() => select(c)}
      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink aria-selected:bg-card"
    >
      {c.icon} {c.label}
    </Command.Item>
  );

  const group = (g: Cmd["group"]) => commands.filter((c) => c.group === g);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label={t("placeholder")}
      overlayClassName="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      contentClassName="fixed left-1/2 top-[12vh] z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-line bg-canvas shadow-2xl"
    >
      <Command.Input
        placeholder={t("placeholder")}
        className="w-full border-b border-line bg-transparent px-4 py-4 text-[15px] text-ink outline-none placeholder:text-muted"
      />
      <Command.List className="max-h-[62vh] overflow-y-auto p-2">
        <Command.Empty className="px-3 py-6 text-center text-sm text-muted">
          {t("noResults")}
        </Command.Empty>

        {recentCmds.length > 0 && (
          <Command.Group heading={t("groupRecent")} className={headingCls}>
            {recentCmds.map((c) => renderItem(c, "recent:"))}
          </Command.Group>
        )}

        <Command.Group heading={t("groupNavigate")} className={headingCls}>
          {group("navigate").map((c) => renderItem(c))}
        </Command.Group>

        <Command.Group heading={t("groupActions")} className={headingCls}>
          {group("actions").map((c) => renderItem(c))}
        </Command.Group>

        <Command.Group heading={t("groupDeveloper")} className={headingCls}>
          {group("developer").map((c) => renderItem(c))}
        </Command.Group>

        <Command.Group heading={t("groupSocial")} className={headingCls}>
          {group("social").map((c) => renderItem(c))}
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
