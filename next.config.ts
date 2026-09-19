import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // In local dev, proxy /api/py/* to the FastAPI backend (uvicorn on :8020).
  // In production, vercel.json handles this routing instead.
  async rewrites() {
    if (process.env.NODE_ENV !== "development") return [];
    return [{ source: "/api/py/:path*", destination: "http://127.0.0.1:8020/api/py/:path*" }];
  },
};

export default withNextIntl(nextConfig);
