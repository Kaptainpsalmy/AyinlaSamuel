"""Live 'now' status: current role, Lagos time, and latest GitHub commit.
Matches the reference site's response shape, plus Lagos time and a 'building' line.
"""
from datetime import datetime, timezone, timedelta
import httpx
from fastapi import APIRouter
from api.core.config import settings

router = APIRouter(tags=["live"])

LAGOS = timezone(timedelta(hours=1))  # West Africa Time (no DST)


async def _latest_commit() -> dict | None:
    """Most recent public push event for the user. Unauthenticated unless a token is set."""
    headers = {"Accept": "application/vnd.github+json", "User-Agent": "psalmnova"}
    if settings.github_token:
        headers["Authorization"] = f"Bearer {settings.github_token}"
    url = f"https://api.github.com/users/{settings.github_user}/events/public"
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            r = await client.get(url, headers=headers)
            r.raise_for_status()
            for ev in r.json():
                if ev.get("type") == "PushEvent":
                    repo = ev["repo"]["name"]  # "owner/name"
                    commits = ev["payload"].get("commits", [])
                    msg = commits[-1]["message"] if commits else "pushed changes"
                    return {
                        "repo": repo,
                        "repoShort": repo.split("/")[-1],
                        "message": msg.split("\n")[0][:120],
                        "pushedAt": ev.get("created_at"),
                        "url": f"https://github.com/{repo}",
                    }
    except Exception:
        return None
    return None


@router.get(
    "/api/py/now",
    summary="Live activity",
    responses={
        200: {
            "content": {
                "application/json": {
                    "example": {
                        "activity": {
                            "latestCommit": {
                                "repo": "kaptainpsalmy/psalmnova",
                                "repoShort": "psalmnova",
                                "message": "feat: wire the live signals rail",
                                "pushedAt": "2026-09-20T07:15:00Z",
                                "url": "https://github.com/kaptainpsalmy/psalmnova",
                            }
                        },
                        "role": "Software Engineer at BEMA Integrated Services",
                        "lagosTime": "2026-09-20T08:40:30+01:00",
                        "building": "psalmnova.vercel.app",
                    }
                }
            }
        }
    },
)
async def now() -> dict:
    """Current role, Lagos local time, and latest public commit (best effort)."""
    commit = await _latest_commit()
    return {
        "activity": {"latestCommit": commit},
        "role": settings.role_now,
        "lagosTime": datetime.now(LAGOS).isoformat(),
        "building": settings.building_now,
    }
