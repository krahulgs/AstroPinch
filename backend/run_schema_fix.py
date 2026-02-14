
import asyncio
from database import AsyncSessionLocal
from services.reset_password_migration import add_reset_columns

if __name__ == "__main__":
    asyncio.run(add_reset_columns(AsyncSessionLocal))
