"use client";
import { useEffect } from "react";

/**
 * Last-resort error page: shown when something crashes above every other error
 * boundary. It replaces the root layout, so it has no global styles, fonts or
 * translations (the message providers live in that layout): a few inline
 * styles in the site palette, following the OS color scheme.
 *
 * Reporting: the error is handed to reportError(), which the Sentry setup in
 * instrumentation-client.ts picks up. Errors with a digest came from the server
 * and were already reported there (instrumentation.ts), so they are skipped.
 */
const css = `
  :root { color-scheme: light dark; --bg: #fafaf8; --ink: #0d0d0d; --muted: #59595a; --accent: #2b2bff; --line: rgba(13,13,13,.18); }
  @media (prefers-color-scheme: dark) { :root { --bg: #0e0e10; --ink: #f2f2f0; --muted: #9a9a9c; --accent: #5b5bff; --line: rgba(255,255,255,.18); } }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: var(--bg); color: var(--ink); font-family: system-ui, sans-serif; }
  main { max-width: 28rem; padding: 2rem; text-align: center; }
  p.code { font: 12px ui-monospace, monospace; letter-spacing: .18em; text-transform: uppercase; color: var(--accent); }
  h1 { margin: .5rem 0 0; font-size: 2rem; letter-spacing: -.02em; }
  p.lead { color: var(--muted); line-height: 1.5; }
  .row { display: flex; gap: .75rem; justify-content: center; margin-top: 1.5rem; }
  button, a { font: 500 14px system-ui, sans-serif; padding: .7rem 1.4rem; border-radius: 999px; cursor: pointer; text-decoration: none; }
  button { background: var(--ink); color: var(--bg); border: 0; }
  a { color: var(--ink); border: 1px solid var(--line); }
`;

export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    if (!error.digest) reportError(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <title>Something went wrong | PsalmNova</title>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <main>
          <p className="code">Error</p>
          <h1>Something went wrong</h1>
          <p className="lead">This page hit an unexpected error. Try again, or head back to the home page.</p>
          <div className="row">
            <button onClick={() => retry()}>Try again</button>
            <a href="/">Home</a>
          </div>
        </main>
      </body>
    </html>
  );
}
