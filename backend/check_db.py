
import asyncio
from sqlalchemy.future import select
from database import AsyncSessionLocal
from models import User, AuthMethod

async def main():
    try:
        print("----------------START----------------")
        async with AsyncSessionLocal() as db:
            result = await db.execute(select(User))
            users = result.scalars().all()
            print(f"Total Users: {len(users)}")
            for u in users:
                print(f"User: {u.email} (ID: {u.id})")
                res_auth = await db.execute(select(AuthMethod).filter(AuthMethod.user_id == u.id))
                auths = res_auth.scalars().all()
                for a in auths:
                     print(f"  Auth: {a.provider}, Identifier: {a.identifier}")
        print("----------------END----------------")
    except Exception as e:
        print(f"Error checking DB: {e}")

if __name__ == "__main__":
    asyncio.run(main())
