
import asyncio
from sqlalchemy import text
from database import AsyncSessionLocal

async def check_columns():
    print("Checking schema...")
    async with AsyncSessionLocal() as db:
        try:
            await db.execute(text("SELECT reset_token FROM users LIMIT 1"))
            print("Column 'reset_token' EXISTS.")
        except Exception as e:
            print(f"Column 'reset_token' MISSING or Error: {e}")

if __name__ == "__main__":
    asyncio.run(check_columns())
