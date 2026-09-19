"""SQLModel tables: project view counts and contact messages."""
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field


class ProjectView(SQLModel, table=True):
    __tablename__ = "project_views"
    slug: str = Field(primary_key=True)
    count: int = Field(default=0)


class ContactMessage(SQLModel, table=True):
    __tablename__ = "contact_messages"
    id: int | None = Field(default=None, primary_key=True)
    name: str
    email: str
    subject: str | None = None
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    sent: bool = Field(default=False)
