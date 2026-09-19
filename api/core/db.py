"""Lazy async DB access. Returns None when DATABASE_URL is unset so callers degrade."""
from typing import Optional
from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.orm import sessionmaker

from api.core.config import settings

_engine: Optional[AsyncEngine] = None


def _normalize(url: str) -> str:
    # Neon / generic Postgres URLs -> asyncpg driver
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+asyncpg://", 1)
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+asyncpg://", 1)
    return url


def get_engine() -> Optional[AsyncEngine]:
    global _engine
    if not settings.database_url:
        return None
    if _engine is None:
        _engine = create_async_engine(_normalize(settings.database_url), pool_pre_ping=True)
    return _engine


def session_maker():
    engine = get_engine()
    if engine is None:
        return None
    return sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def init_db() -> bool:
    """Create tables if the DB is configured. Returns True on success."""
    from api.models.tables import SQLModel as _  # ensure models imported
    engine = get_engine()
    if engine is None:
        return False
    async with engine.begin() as conn:
        from sqlmodel import SQLModel
        await conn.run_sync(SQLModel.metadata.create_all)
    return True
