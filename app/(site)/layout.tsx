import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { CommandMenu } from "@/components/layout/CommandMenu";
import { BackToTop } from "@/components/layout/BackToTop";
import { ToastHost } from "@/components/common/Toast";
import { AskAI } from "@/components/interactive/AskAI";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-line focus:bg-canvas focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <CommandMenu />
      <BackToTop />
      <ToastHost />
      <AskAI />
    </>
  );
}
