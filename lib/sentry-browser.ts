import {
  init,
  captureException,
  breadcrumbsIntegration,
  dedupeIntegration,
  globalHandlersIntegration,
  httpContextIntegration,
  linkedErrorsIntegration,
} from "@sentry/browser";
import { sentryDataCollection } from "./sentry-privacy";

/**
 * The browser half of error reporting, loaded on demand by
 * instrumentation-client.ts. Named imports from @sentry/browser with the
 * default integrations switched off keep this chunk small: importing
 * "@sentry/nextjs" whole pulled in session replay, the feedback widget and
 * tracing (560 KB raw, 180 KB gzipped) and blocked the main thread after load.
 *
 * Kept: uncaught errors and rejections, error causes, de-duplication, page and
 * browser context, and a breadcrumb trail of navigations, clicks and requests.
 */
export function startSentry(dsn: string) {
  init({
    dsn,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "production",
    dataCollection: sentryDataCollection,
    defaultIntegrations: false,
    integrations: [
      globalHandlersIntegration(),
      linkedErrorsIntegration(),
      dedupeIntegration(),
      httpContextIntegration(),
      breadcrumbsIntegration({ xhr: false }),
    ],
  });
  return captureException;
}
