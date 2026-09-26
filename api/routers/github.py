"""GitHub contribution calendar for the configured user.
Uses the public contributions GraphQL when a token is available; otherwise returns a
clearly-marked sample so the UI still renders.
"""
import httpx
from fastapi import APIRouter
from api.core.config import settings

router = APIRouter(tags=["live"])

GQL = """
query($login:String!){ user(login:$login){ contributionsCollection{
  contributionCalendar{ totalContributions
    weeks{ contributionDays{ date contributionCount } } } } } }
"""


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
        try:
            async with httpx.AsyncClient(timeout=8) as client:
                r = await client.post(
                    "https://api.github.com/graphql",
                    headers={"Authorization": f"Bearer {settings.github_token}"},
                    json={"query": GQL, "variables": {"login": settings.github_user}},
                )
                r.raise_for_status()
                cal = r.json()["data"]["user"]["contributionsCollection"]["contributionCalendar"]
                return {"source": "live", "total": cal["totalContributions"],
                        "weeks": [[d["contributionCount"] for d in w["contributionDays"]] for w in cal["weeks"]]}
        except Exception:
            pass
    # sample fallback (marked): 53 weeks x 7 days of light activity
    import random
    random.seed(7)
    weeks = [[random.choice([0, 0, 1, 1, 2, 3, 4]) for _ in range(7)] for _ in range(53)]
    total = sum(sum(w) for w in weeks)
    return {"source": "sample", "total": total, "weeks": weeks}
