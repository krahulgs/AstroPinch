import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

# Default to SQLite for local development if DATABASE_URL is not provided
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./astropinch_v2.db")

# Render provides postgres:// or postgresql:// but SQLAlchemy async needs postgresql+asyncpg://
if DATABASE_URL.startswith("postgres"):
    # Re-check and replace any variant of postgres:// or postgresql:// with exactly postgresql+asyncpg://
    # This handles postgres://, postgresql://, and potentially malformed ones from env vars.
    if "postgresql+asyncpg" not in DATABASE_URL:
        # Replace the first occurrence of the protocol
        prefix = DATABASE_URL.split("://")[0]
        DATABASE_URL = DATABASE_URL.replace(prefix + "://", "postgresql+asyncpg://", 1)

# Debugging (redacted)
if "postgresql" in DATABASE_URL:
    print(f"DATABASE_URL detected as PostgreSQL, ensuring async driver... (URL starts with {DATABASE_URL[:20]}...)")
else:
    print(f"DATABASE_URL detected as: {DATABASE_URL.split('://')[0]}://...")

engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
