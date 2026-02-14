
import asyncio
from sqlalchemy.future import select
from database import AsyncSessionLocal
from models import User, AuthMethod

async def fix_emails():
    print("Migrating emails to lowercase...")
    try:
        async with AsyncSessionLocal() as db:
            # Users
            res = await db.execute(select(User))
            users = res.scalars().all()
            for u in users:
                if u.email and u.email != u.email.lower():
                    print(f"Fixing User: {u.email} -> {u.email.lower()}")
                    u.email = u.email.lower()
            
            # AuthMethods
            res = await db.execute(select(AuthMethod))
            auths = res.scalars().all()
            for a in auths:
                if a.identifier and a.identifier != a.identifier.lower():
                     print(f"Fixing Auth: {a.identifier} -> {a.identifier.lower()}")
                     a.identifier = a.identifier.lower()
            
            await db.commit()
            print("Migration complete.")
    except Exception as e:
        print(f"Migration failed (duplicate?): {e}")

if __name__ == "__main__":
    asyncio.run(fix_emails())
