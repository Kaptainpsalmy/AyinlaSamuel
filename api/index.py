"""PsalmNova API — FastAPI backend, deployed on Vercel's Python runtime.

Reached from the site via same-origin `fetch("/api/py/...")` (see vercel.json),
so no CORS is needed. Kept lean for serverless cold starts — no heavy ML libs.
"""
from datetime import datetime, timezone

from fastapi import FastAPI

app = FastAPI(
    title="PsalmNova API",
    version="0.1.0",
    description="Backend for psalmnova.vercel.app — Ayinla Samuel Olorunwa.",
    docs_url="/api/py/docs",
    openapi_url="/api/py/openapi.json",
    redoc_url="/api/py/redoc",
)


@app.get("/api/py/health", tags=["system"], summary="Health check")
def health() -> dict:
    """Liveness probe. Returns status, version, and server time (UTC)."""
    return {
        "status": "ok",
        "version": app.version,
        "time": datetime.now(timezone.utc).isoformat(),
    }
