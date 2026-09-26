from datetime import datetime, timezone
from fastapi import APIRouter
from api.core.config import settings

router = APIRouter(tags=["system"])


@router.get(
    "/api/py/health",
    summary="Health check",
    responses={
        200: {
            "content": {
                "application/json": {
                    "example": {
                        "status": "ok",
                        "version": "0.1.0",
                        "time": "2026-09-20T08:40:30.980283+00:00",
                    }
                }
            }
        }
    },
)
def health() -> dict:
    """Liveness probe. Returns status, version, and server time (UTC)."""
    return {"status": "ok", "version": settings.version, "time": datetime.now(timezone.utc).isoformat()}
