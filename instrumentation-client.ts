/**
 * Browser error reporting (Sentry), loaded once the page is idle instead of
 * before it becomes interactive (see lib/sentry-browser.ts for why it is a
 * slim build). Errors from before it loads are held here and sent as soon as
 * it is ready, so nothing early is lost.
 *
 * Only active in production builds with NEXT_PUBLIC_SENTRY_DSN set. The server
 * side lives in instrumentation.ts.
 */
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn && process.env.NODE_ENV === "production") {
  const early: unknown[] = [];
  const onError = (e: ErrorEvent) => early.push(e.error ?? e.message);
  const onRejection = (e: PromiseRejectionEvent) => early.push(e.reason);
  addEventListener("error", onError);
  addEventListener("unhandledrejection", onRejection);

  const load = () =>
    import("@/lib/sentry-browser")
      .then(({ startSentry }) => {
        const capture = startSentry(dsn);
        removeEventListener("error", onError);
        removeEventListener("unhandledrejection", onRejection);
        for (const err of early.splice(0)) capture(err);
      })
      .catch(() => {}); // an ad blocker or offline visitor must never break the page

  if ("requestIdleCallback" in window) requestIdleCallback(load, { timeout: 5000 });
  else setTimeout(load, 3000);
}

