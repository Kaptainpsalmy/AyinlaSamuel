import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs/config";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Not using experimental.inlineCss: measured on this site it doubled page
  // weight (the stylesheet shipped as a <style> tag and again in the React
  // payload), made LCP worse, and let the web-font swap shift the project
  // gallery (CLS 0.26). A cached external stylesheet wins here.
  //
  // In local dev, proxy /api/py/* to the FastAPI backend (uvicorn on :8020).
  // In production, vercel.json handles this routing instead. API_PROXY=1 turns
  // the proxy on for a local production build (`API_PROXY=1 pnpm build`), so
  // `next start` can be tested with the live widgets working.
  async rewrites() {
    if (process.env.NODE_ENV !== "development" && process.env.API_PROXY !== "1") return [];
    return [{ source: "/api/py/:path*", destination: "http://127.0.0.1:8020/api/py/:path*" }];
  },
};

const config = withNextIntl(nextConfig);

// Sentry only touches the build to upload source maps, so error reports show
// real file names and lines instead of minified code. It needs SENTRY_AUTH_TOKEN
// (plus SENTRY_ORG and SENTRY_PROJECT) in Vercel; without them the build is
// left exactly as it is. Runtime reporting is set up in instrumentation*.ts.
export default process.env.SENTRY_AUTH_TOKEN
  ? withSentryConfig(config, {
      silent: true,
      telemetry: false,
      // The maps are uploaded, then deleted from the deploy, so visitors never
      // download the original source.
      sourcemaps: { deleteSourcemapsAfterUpload: true },
      // A failed upload (bad token, Sentry down) must never block a deploy.
      errorHandler: (err: Error) => console.warn("Sentry source map upload failed:", err.message),
    })
  : config;
