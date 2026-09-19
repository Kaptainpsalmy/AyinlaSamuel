"use client";
import { useEffect, useState, useCallback } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Folder, FileText, Briefcase, User, FlaskConical, FileBadge, Mail,
  Copy, Download, Activity, Sparkles, Target,
  SunMoon, Languages, Check,
} from "lucide-react";
import { GithubIcon as Github, LinkedinIcon as Linkedin, TwitterIcon as Twitter } from "@/components/common/BrandIcons";
import { site, nav } from "@/content/site";
import { useTheme } from "./ThemeProvider";
import { setLocale } from "@/i18n/actions";

const navIcons: Record<string, typeof Folder> = {
  "/projects": Folder, "/notes": FileText, "/experience": Briefcase,
  "/about": User, "/sandbox": FlaskConical, "/cv": FileBadge, "/contact": Mail,
};

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const { toggle } = useTheme();
  const t = useTranslations("command");

  // open on Cmd/Ctrl+K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", onKey);
    // allow other components to open it via a custom event
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
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }, []);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label={t("placeholder")}
      overlayClassName="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      contentClassName="fixed left-1/2 top-[15vh] z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-line bg-canvas shadow-2xl"
    >
      <Command.Input
        placeholder={t("placeholder")}
        className="w-full border-b border-line bg-transparent px-4 py-4 text-[15px] text-ink outline-none placeholder:text-muted"
      />
      <Command.List className="max-h-[50vh] overflow-y-auto p-2">
        <Command.Empty className="px-3 py-6 text-center text-sm text-muted">
          No results.
        </Command.Empty>

        <Command.Group heading={t("groupNavigate")} className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted">
          {nav.map((n) => {
            const Icon = navIcons[n.href] ?? Folder;
            return (
              <Item key={n.href} onSelect={() => go(n.href)}>
                <Icon size={16} /> {n.label}
              </Item>
            );
          })}
        </Command.Group>

        <Command.Group heading={t("groupActions")} className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted">
          <Item onSelect={copyEmail} keywords={["email", "mail", "contact"]}>
            {copied ? <Check size={16} className="text-ok" /> : <Copy size={16} />}
            {copied ? t("copied") : t("copyEmail")}
          </Item>
          <Item onSelect={() => go("/cv")} keywords={["resume", "download"]}>
            <Download size={16} /> {t("downloadCv")}
          </Item>
          <Item onSelect={() => go("/api/py/now", true)} keywords={["now", "live", "activity", "status"]}>
            <Activity size={16} /> {t("viewNow")}
          </Item>
          <Item onSelect={() => { setOpen(false); document.dispatchEvent(new CustomEvent("open-ai")); }} keywords={["ai", "chat", "assistant"]}>
            <Sparkles size={16} /> {t("askAi")}
          </Item>
          <Item onSelect={() => go("/contact")} keywords={["job", "jd", "match", "hire"]}>
            <Target size={16} /> {t("matchJd")}
          </Item>
          <Item onSelect={() => { toggle(); }} keywords={["dark", "light", "theme", "mode"]}>
            <SunMoon size={16} /> {t("toggleTheme")}
          </Item>
          <Item onSelect={async () => { const cur = document.documentElement.lang; await setLocale(cur === "yo" ? "en" : "yo"); setOpen(false); router.refresh(); }} keywords={["language", "yoruba", "english", "ede"]}>
            <Languages size={16} /> {t("switchLanguage")}
          </Item>
        </Command.Group>

        <Command.Group heading={t("groupSocial")} className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted">
          <Item onSelect={() => go(site.socials.github, true)}><Github size={16} /> {t("openGithub")}</Item>
          <Item onSelect={() => go(site.socials.linkedin, true)}><Linkedin size={16} /> {t("openLinkedin")}</Item>
          <Item onSelect={() => go(site.socials.twitter, true)}><Twitter size={16} /> {t("openTwitter")}</Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}

function Item({
  children, onSelect, keywords,
}: { children: React.ReactNode; onSelect: () => void; keywords?: string[] }) {
  return (
    <Command.Item
      onSelect={onSelect}
      keywords={keywords}
      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink aria-selected:bg-card"
    >
      {children}
    </Command.Item>
  );
}
