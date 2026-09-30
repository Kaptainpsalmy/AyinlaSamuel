"""GitHub contribution calendar for the configured user.
Uses the public contributions GraphQL when a token is available; otherwise returns a
clearly-marked sample so the UI still renders.

Accounts listed in GITHUB_EXTRA_USERS are added into the same graph, day by day, so
work done under another account counts without that account being named anywhere
on the site or in this repository.
"""
import asyncio

import httpx
from fastapi import APIRouter
from api.core.config import settings

router = APIRouter(tags=["live"])

GQL = """
query($login:String!){ user(login:$login){ contributionsCollection{
  contributionCalendar{ totalContributions
    weeks{ contributionDays{ date contributionCount } } } } } }
"""


async def _calendar(client: httpx.AsyncClient, login: str) -> list[list[dict]] | None:
    """One account's last-year calendar as weeks of {date, contributionCount}, or None."""
    try:
        r = await client.post(
            "https://api.github.com/graphql",
            headers={"Authorization": f"Bearer {settings.github_token}"},
            json={"query": GQL, "variables": {"login": login}},
        )
        r.raise_for_status()
        user = r.json()["data"]["user"]
        if not user:
            return None
        return [w["contributionDays"] for w in user["contributionsCollection"]["contributionCalendar"]["weeks"]]
    except Exception:
        return None


@router.get(
    "/api/py/github/contributions",
    summary="Contribution calendar",
    responses={
        200: {
            "content": {
                "application/json": {
                    "example": {
                        "source": "github",
                        "total": 5305,
                        "weeks": [[0, 1, 3, 0, 2, 4, 1], [2, 0, 0, 5, 1, 0, 3]],
                    }
                }
            }
        }
    },
)
async def contributions() -> dict:
    """Weeks of contribution counts. Real when a GitHub token is set, else a sample."""
    if settings.github_token:
        extra = [u.strip() for u in (settings.github_extra_users or "").split(",") if u.strip()]
        async with httpx.AsyncClient(timeout=8) as client:
            main, *others = await asyncio.gather(
                *(_calendar(client, login) for login in [settings.github_user, *extra])
            )
        if main:
            # Every account's calendar covers the same dates (the last year), so add
            # the other accounts' counts onto the main account's days by date.
            per_day: dict[str, int] = {}
            for cal in others:
                for week in cal or []:
                    for d in week:
                        per_day[d["date"]] = per_day.get(d["date"], 0) + d["contributionCount"]
            weeks = [[d["contributionCount"] + per_day.get(d["date"], 0) for d in week] for week in main]
            return {"source": "live", "total": sum(sum(w) for w in weeks), "weeks": weeks}
    # sample fallback (marked): 53 weeks x 7 days of light activity
    import random
    random.seed(7)
    weeks = [[random.choice([0, 0, 1, 1, 2, 3, 4]) for _ in range(7)] for _ in range(53)]
    total = sum(sum(w) for w in weeks)
    return {"source": "sample", "total": total, "weeks": weeks}
