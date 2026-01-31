import asyncio
import json
import os
from datetime import datetime
from sqlalchemy.future import select
from backend.database import engine, Base, AsyncSessionLocal
from backend.models import User, Profile, AuthMethod, AuthProvider, AstrologySystem

# Path to the old JSON file
OLD_DATA_FILE = "backend/data/profiles.json"

async def migrate():
    print("Starting migration...")
    
    # 1. Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    if not os.path.exists(OLD_DATA_FILE):
        print("No legacy data found. Skipping migration.")
        return

    async with AsyncSessionLocal() as session:
        # Load JSON data
        with open(OLD_DATA_FILE, "r") as f:
            profiles_data = json.load(f)
        
        if not profiles_data:
            print("Legacy data is empty.")
            return

        # 2. Create a default "Legacy User" if not exists
        # In a real app, we might split this based on context, 
        # but for now, we'll associate all existing profiles with one default user for the 'Self' relationship.
        result = await session.execute(select(User).filter(User.email == "legacy@astropinch.com"))
        user = result.scalars().first()
        
        if not user:
            user = User(
                email="legacy@astropinch.com",
                full_name="Legacy User",
                is_active=True
            )
            session.add(user)
            await session.flush() # Get user ID
            print(f"Created default user: {user.email}")
            
            # Add an AuthMethod for legacy login (placeholder)
            auth = AuthMethod(
                user_id=user.id,
                provider=AuthProvider.EMAIL,
                identifier="legacy@astropinch.com",
                secret_hash="PLACEHOLDER" # User will need to reset password
            )
            session.add(auth)

        # 3. Migrate Profiles
        for p_data in profiles_data:
            # Check if profile already exists by ID
            res = await session.execute(select(Profile).filter(Profile.id == p_data['id']))
            if res.scalars().first():
                continue
            
            # Parse Date/Time
            b_date = datetime.strptime(p_data['birth_date'], "%Y-%m-%d").date()
            # Handle potential time formats
            t_str = p_data['birth_time']
            if len(t_str.split(':')) == 2:
                b_time = datetime.strptime(t_str, "%H:%M").time()
            else:
                b_time = datetime.strptime(t_str, "%H:%M:%S").time()

            profile = Profile(
                id=p_data['id'],
                owner_id=user.id,
                name=p_data['name'],
                gender="other", # Default since legacy didn't have it
                birth_date=b_date,
                birth_time=b_time,
                latitude=p_data['latitude'],
                longitude=p_data['longitude'],
                location_name=p_data['location_name'],
                timezone_id=p_data['timezone_id'],
                utc_offset=p_data.get('utc_offset', 0.0),
                ayanamsa=p_data.get('ayanamsa', 'Lahiri'),
                relation=p_data.get('relationship', 'Self'),
                profession=p_data.get('profession'),
                marital_status=p_data.get('marital_status'),
                system=AstrologySystem.BOTH,
                created_at=datetime.utcnow()
            )
            session.add(profile)
            print(f"Migrated profile: {profile.name}")
        
        await session.commit()
    print("Migration completed successfully.")

if __name__ == "__main__":
    asyncio.run(migrate())
