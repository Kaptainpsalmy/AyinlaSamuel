"""Input hygiene for the contact form."""
import re

_EMAIL = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def valid_email(email: str) -> bool:
    return bool(_EMAIL.match(email.strip()))


def clean(text: str, limit: int = 5000) -> str:
    return text.strip()[:limit]
