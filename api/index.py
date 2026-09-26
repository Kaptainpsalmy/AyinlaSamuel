"""PsalmNova API. FastAPI backend on Vercel's Python runtime.

Reached same-origin via /api/py/* (see vercel.json), so no CORS is needed.
Kept lean for serverless cold starts: no ML libs. The OpenAPI docs page at
/api/py/docs is itself a portfolio exhibit.
"""
from fastapi import FastAPI

from api.core.config import settings
from api.routers import health, now, github, contact, views, resume, chat

# Error reporting (Sentry) only on Vercel with a DSN set, so local runs never
# spend the free quota. The FastAPI integration switches on automatically.
# Privacy: no request bodies (contact form, chat questions), no local variables,
# no cookies or IPs. Reports carry the error, stack trace and endpoint.
if settings.sentry_dsn and settings.vercel_env != "development":
    import sentry_sdk

    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        environment=settings.vercel_env,
        send_default_pii=False,
        max_request_body_size="never",
        include_local_variables=False,
    )

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

for r in (health, now, github, contact, views, resume, chat):
    app.include_router(r.router)
