import type { Metadata } from "next";
import { displaySans, mono } from "@/lib/fonts";
import { ThemeScript } from "@/components/layout/ThemeScript";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ayinla Samuel — PsalmNova",
    template: "%s — PsalmNova",
  },
  description:
    "Ayinla Samuel Olorunwa — Backend & AI Software Engineer. FastAPI, RAG, agentic systems.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${displaySans.variable} ${mono.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
