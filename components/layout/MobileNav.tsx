"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Home, FolderKanban, Sparkles, FileText, Mail } from "lucide-react";
import { toast } from "@/components/common/Toast";

/**
 * Thumb-reachable bottom navigation for small screens (hidden at lg+, where the
 * persistent sidebar takes over). Safe-area aware. The AI item opens the chat
 * via the same cancelable event the palette uses.
 */
const items = [
  { href: "/", key: "home", icon: Home },
  { href: "/projects", key: "work", icon: FolderKanban },
  { href: "#ai", key: "ai", icon: Sparkles, action: "ai" as const },
  { href: "/notes", key: "notes", icon: FileText },
  { href: "/contact", key: "contact", icon: Mail },
] as const;

export function MobileNav() {
  const t = useTranslations("mobileNav");
  const tc = useTranslations("common");
  const pathname = usePathname();

  return (
    <nav
      aria-label={t("label")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex items-stretch justify-around">
        {items.map((item) => {
          const { href, key, icon: Icon } = item;
          const isAi = "action" in item;
          const active = isAi ? false : href === "/" ? pathname === "/" : pathname.startsWith(href);
          const cls = `flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] ${
            active ? "text-accent-2" : "text-muted"
          }`;
          if (isAi) {
            return (
              <li key={key} className="flex flex-1">
                <button
                  type="button"
                  className={cls + " w-full"}
                  onClick={() => {
                    const heard = document.dispatchEvent(
                      new CustomEvent("open-ai", { cancelable: true }),
                    );
                    if (heard) toast(tc("aiComingSoon"));
                  }}
                >
                  <Icon size={20} aria-hidden />
                  {t(key)}
                </button>
              </li>
            );
          }
          return (
            <li key={key} className="flex flex-1">
              <Link href={href} aria-current={active ? "page" : undefined} className={cls + " w-full"}>
                <Icon size={20} aria-hidden />
                {t(key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
