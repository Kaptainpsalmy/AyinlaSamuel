import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { LazyCommandMenu } from "@/components/layout/LazyCommandMenu";
import { BackToTop } from "@/components/layout/BackToTop";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { EdgeMarquee } from "@/components/sections/EdgeMarquee";
import { ToastHost } from "@/components/common/Toast";
import { AskAI } from "@/components/interactive/AskAI";
import { PageTransition } from "@/components/motion/PageTransition";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const t = await getTranslations("common");
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-line focus:bg-canvas focus:px-4 focus:py-2 focus:text-ink"
      >
        {t("skipToContent")}
      </a>

      {/* Persistent identity rail on the left at lg+; the content column is
          offset with lg:ml-80 to clear it. The edge marquee rides its border. */}
      <Sidebar />
      <EdgeMarquee />

      <div className="lg:ml-80">
        <Nav />
        {/* pb-24 on mobile keeps content clear of the fixed bottom nav */}
        <main id="main-content" className="flex-1 pb-24 lg:pb-0">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </div>

      <MobileNav />
      <LazyCommandMenu />
      <BackToTop />
      <ToastHost />
      <AskAI />
    </>
  );
}
