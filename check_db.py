import asyncio
import os
from sqlalchemy.future import select
from database import AsyncSessionLocal, engine
from models import User, Profile, AuthMethod

async def check_db():
    async with AsyncSessionLocal() as db:
        # Check users and their profiles
        result = await db.execute(select(User))
        users = result.scalars().all()
        print(f"Total Users: {len(users)}")
        
        for u in users:
            print(f"\nUser: {u.full_name} ({u.email}) ID: {u.id}")
            p_result = await db.execute(select(Profile).filter(Profile.owner_id == u.id))
            user_profiles = p_result.scalars().all()
            print(f"  Profiles: {len(user_profiles)}")
            for p in user_profiles:
                print(f"    - {p.name} ({p.relation}) id: {p.id}")

if __name__ == "__main__":
    # Ensure we are in the right directory or use absolute path
    asyncio.run(check_db())
