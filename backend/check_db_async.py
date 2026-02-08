
import asyncio
from database import AsyncSessionLocal, engine
from models import Profile
from sqlalchemy import select

async def check_db():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Profile).order_by(Profile.created_at.desc()))
        p = result.scalars().first()
        if p:
            print(f"DEBUG DB: Profile Name: {p.name}")
            print(f"DEBUG DB: Lat: {p.latitude}, Lng: {p.longitude}")
            print(f"DEBUG DB: Birth: {p.birth_date} {p.birth_time}")
            print(f"DEBUG DB: Timezone: {p.timezone_id}")
        else:
            print("DEBUG DB: No profiles found.")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(check_db())
