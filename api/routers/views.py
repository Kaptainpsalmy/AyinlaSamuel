"""Per-project view counter. Returns 0 and no-ops when the DB is unset."""
from fastapi import APIRouter
from sqlmodel import select

from api.core.db import session_maker
from api.models.tables import ProjectView

router = APIRouter(tags=["views"])


@router.get("/api/py/projects/{slug}/views", summary="Get view count")
async def get_views(slug: str) -> dict:
    maker = session_maker()
    if maker is None:
        return {"slug": slug, "views": 0}
    try:
        async with maker() as db:
            row = (await db.exec(select(ProjectView).where(ProjectView.slug == slug))).first()
            return {"slug": slug, "views": row.count if row else 0}
    except Exception:
        return {"slug": slug, "views": 0}


@router.post("/api/py/projects/{slug}/views", summary="Increment view count")
async def add_view(slug: str) -> dict:
    maker = session_maker()
    if maker is None:
        return {"slug": slug, "views": 0}
    try:
        async with maker() as db:
            row = (await db.exec(select(ProjectView).where(ProjectView.slug == slug))).first()
            if row:
                row.count += 1
            else:
                row = ProjectView(slug=slug, count=1)
                db.add(row)
            await db.commit()
            return {"slug": slug, "views": row.count}
    except Exception:
        return {"slug": slug, "views": 0}
