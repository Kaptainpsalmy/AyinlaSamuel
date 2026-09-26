import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { displaySans, mono } from "@/lib/fonts";
import { ThemeScript } from "@/components/layout/ThemeScript";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { pageMeta, siteUrl } from "@/lib/seo";
import { clientNamespaces } from "@/i18n/client-namespaces";
import { site } from "@/content/site";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    // Resolves every relative URL in metadata (canonicals, share images).
    metadataBase: new URL(siteUrl),
    ...(await pageMeta({ description: t("siteDescription"), path: "/" })),
    title: {
      default: "Ayinla Samuel | PsalmNova",
      template: "%s | PsalmNova",
    },
    applicationName: site.brand,
    authors: [{ name: site.name, url: siteUrl }],
    creator: site.name,
    keywords: ["Ayinla Samuel", "PsalmNova", "backend engineer", "AI engineer", "full-stack engineer", "FastAPI", "RAG", "Lagos"],
  };
}

// Browser UI color follows the theme tokens (light canvas / dark canvas).
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e10" },
  ],
};

// Scroll reveals start hidden and are shown by JavaScript. Without JS they would
// stay invisible, so force their final state for no-JS visitors.
const noJsReveal = "<style>[data-reveal]{opacity:1!important;transform:none!important}</style>";

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  // Only what client components read goes to the browser (see i18n/client-namespaces.ts).
  const messages = await getMessages();
  const clientMessages = Object.fromEntries(clientNamespaces.map((ns) => [ns, messages[ns]]));
  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${displaySans.variable} ${mono.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
        <noscript dangerouslySetInnerHTML={{ __html: noJsReveal }} />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={clientMessages}>
          <ThemeProvider>{children}</ThemeProvider>
        </NextIntlClientProvider>
        {/* Cookie-free page views and real-visitor Core Web Vitals. Both only
            report when deployed on Vercel; locally they do nothing. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
