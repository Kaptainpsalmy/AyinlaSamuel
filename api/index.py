"""PsalmNova API. FastAPI backend on Vercel's Python runtime.

Reached same-origin via /api/py/* (see vercel.json), so no CORS is needed.
Kept lean for serverless cold starts: no ML libs. The OpenAPI docs page at
/api/py/docs is itself a portfolio exhibit.
"""
from fastapi import FastAPI

from api.core.config import settings
from api.routers import health, now, github, contact, views, resume

app = FastAPI(
    title="PsalmNova API",
    version=settings.version,
    description=(
        "Backend for psalmnova.vercel.app by Ayinla Samuel Olorunwa. "
        "Live status, GitHub activity, contact, project views, and a generated CV PDF."
    ),
    docs_url="/api/py/docs",
    openapi_url="/api/py/openapi.json",
    redoc_url="/api/py/redoc",
)

for r in (health, now, github, contact, views, resume):
    app.include_router(r.router)
