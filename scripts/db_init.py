"""Create the DB tables. Run once against a configured DATABASE_URL:
    python -m scripts.db_init
"""
import asyncio
from api.core.db import init_db


async def main():
    ok = await init_db()
    print("Tables created." if ok else "No DATABASE_URL set; nothing to do.")


if __name__ == "__main__":
    asyncio.run(main())
