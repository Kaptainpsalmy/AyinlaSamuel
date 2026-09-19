"""Contact form: validate -> rate-limit -> send (Resend) -> persist (Neon).
Degrades to persist-only when Resend is unset, and to accept-only when the DB is unset.
"""
from fastapi import APIRouter, Request
from pydantic import BaseModel, Field
import httpx
from sqlmodel import select

from api.core.config import settings
from api.core.ratelimit import allow
from api.core.security import valid_email, clean
from api.core.db import session_maker
from api.models.tables import ContactMessage

router = APIRouter(tags=["contact"])


class ContactIn(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    email: str = Field(min_length=3, max_length=320)
    subject: str | None = Field(default=None, max_length=300)
    message: str = Field(min_length=10, max_length=5000)
    company: str | None = None  # honeypot


async def _send_email(data: ContactIn) -> bool:
    if not settings.resend_api_key:
        return False
    try:
        async with httpx.AsyncClient(timeout=8) as client:
            r = await client.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {settings.resend_api_key}"},
                json={
                    "from": "PsalmNova <onboarding@resend.dev>",
                    "to": [settings.contact_to_email],
                    "reply_to": data.email,
                    "subject": f"Portfolio: {data.subject or 'New message'}",
                    "text": f"From {data.name} <{data.email}>\n\n{data.message}",
                },
            )
            r.raise_for_status()
            return True
    except Exception:
        return False


async def _persist(data: ContactIn, sent: bool) -> None:
    maker = session_maker()
    if maker is None:
        return
    try:
        async with maker() as db:
            db.add(ContactMessage(name=data.name, email=data.email, subject=data.subject,
                                  message=data.message, sent=sent))
            await db.commit()
    except Exception:
        pass


@router.post("/api/py/contact", summary="Send a contact message")
async def contact(data: ContactIn, request: Request) -> dict:
    # honeypot: pretend success for bots
    if data.company:
        return {"status": "sent"}

    if not valid_email(data.email):
        return {"status": "invalid", "field": "email"}

    ip = request.client.host if request.client else "unknown"
    if not await allow(f"contact:{ip}", limit=5, window_s=3600):
        return {"status": "rate_limited"}

    data.message = clean(data.message)
    sent = await _send_email(data)
    await _persist(data, sent)
    return {"status": "sent" if sent else "stored"}
