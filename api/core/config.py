"""Settings. Every external key is optional; endpoints degrade gracefully when absent."""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env.local", extra="ignore")

    # identity / non-secret
    github_user: str = "kaptainpsalmy"
    contact_to_email: str = "kaptainpsalmy@gmail.com"
    role_now: str = "Software Engineer at BEMA Integrated Services"
    building_now: str = "psalmnova.vercel.app"

    # optional secrets (graceful degradation if unset)
    database_url: str | None = None
    upstash_redis_rest_url: str | None = None
    upstash_redis_rest_token: str | None = None
    resend_api_key: str | None = None
    github_token: str | None = None
    groq_api_key: str | None = None
    sentry_dsn: str | None = None  # error reporting; off when unset
    # Other GitHub accounts whose contributions are added into the one graph, comma
    # separated. Kept in the environment, not in code, so the names stay private.
    github_extra_users: str | None = None
    vercel_env: str = "development"  # set by Vercel: production / preview

    version: str = "0.1.0"


settings = Settings()
