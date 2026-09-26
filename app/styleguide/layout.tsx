import type { Metadata } from "next";

// The styleguide is a development tool: keep it out of search results. It
// sets its own canonical so it does not inherit the home page's.
export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
  alternates: { canonical: "/styleguide" },
};

export default function StyleguideLayout({ children }: { children: React.ReactNode }) {
  return children;
}
