import asyncio
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from database import AsyncSessionLocal
from models import Profile
from sqlalchemy import update

async def fix():
    # Target User: rahulgskumar12@gmail.com
    target_user_id = 'ea8d1dbc-8da8-40e3-bc12-250065b1fd1a'
    # Source User: Legacy User
    legacy_user_id = '9e3b0ae7-8bad-4f1e-95c4-b23e1140de7b'
    
    async with AsyncSessionLocal() as db:
        print(f"Re-assigning profiles from {legacy_user_id} to {target_user_id}...")
        stmt = update(Profile).where(Profile.owner_id == legacy_user_id).values(owner_id=target_user_id)
        result = await db.execute(stmt)
        await db.commit()
        print(f"Done! {result.rowcount} profiles updated.")

if __name__ == "__main__":
    asyncio.run(fix())
