import type { Instrumentation } from "next";
import { sentryDataCollection } from "@/lib/sentry-privacy";

/**
 * Server-side error reporting (Sentry). Only active in production builds with
 * NEXT_PUBLIC_SENTRY_DSN set, so local development never spends the free quota.
 * The browser side lives in instrumentation-client.ts.
 */
const enabled = !!process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.NODE_ENV === "production";

export async function register() {
  // Every route runs on Node (no edge runtime in this app).
  if (!enabled || process.env.NEXT_RUNTIME !== "nodejs") return;
  const Sentry = await import("@sentry/nextjs");
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.VERCEL_ENV ?? "production",
    dataCollection: sentryDataCollection,
  });
}

// Errors thrown while rendering pages or running route handlers on the server.
export const onRequestError: Instrumentation.onRequestError = async (...args) => {
  if (!enabled) return;
  const Sentry = await import("@sentry/nextjs");
  Sentry.captureRequestError(...args);
};
