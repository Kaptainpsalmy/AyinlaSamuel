"""Sliding-window rate limit via Upstash Redis REST. No-op (allows) when unconfigured."""
import time
import httpx
from api.core.config import settings


async def allow(key: str, limit: int = 5, window_s: int = 3600) -> bool:
    """Return True if the caller is under the limit. Fails open if Redis is unset/unreachable."""
    if not (settings.upstash_redis_rest_url and settings.upstash_redis_rest_token):
        return True
    bucket = f"rl:{key}:{int(time.time() // window_s)}"
    headers = {"Authorization": f"Bearer {settings.upstash_redis_rest_token}"}
    try:
        async with httpx.AsyncClient(timeout=3) as client:
            # INCR then EXPIRE via the REST pipeline
            r = await client.post(
                f"{settings.upstash_redis_rest_url}/pipeline",
                headers=headers,
                json=[["INCR", bucket], ["EXPIRE", bucket, str(window_s)]],
            )
            r.raise_for_status()
            count = int(r.json()[0]["result"])
            return count <= limit
    except Exception:
        return True  # fail open: never block a real user because Redis hiccuped
