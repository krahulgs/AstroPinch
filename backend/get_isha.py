
import asyncio
from database import AsyncSessionLocal, engine
from models import Profile
from sqlalchemy import select

async def check_isha():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Profile).where(Profile.name.like("%Isha%")))
        p = result.scalars().first()
        if p:
            print(f"DATA_START")
            print(f"Name:{p.name}")
            print(f"Lat:{p.latitude}")
            print(f"Lng:{p.longitude}")
            print(f"Date:{p.birth_date}")
            print(f"Time:{p.birth_time}")
            print(f"TZ:{p.timezone_id}")
            print(f"DATA_END")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(check_isha())
