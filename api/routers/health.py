from datetime import datetime, timezone
from fastapi import APIRouter
from api.core.config import settings

router = APIRouter(tags=["system"])


@router.get("/api/py/health", summary="Health check")
def health() -> dict:
    """Liveness probe. Returns status, version, and server time (UTC)."""
    return {"status": "ok", "version": settings.version, "time": datetime.now(timezone.utc).isoformat()}
