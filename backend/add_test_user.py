
import asyncio
from database import AsyncSessionLocal
from models import User, AuthMethod, AuthProvider
try:
    from auth_utils import get_password_hash
except ImportError:
    # Fallback if path issue
    import sys
    sys.path.append('.')
    from auth_utils import get_password_hash

from sqlalchemy.future import select

async def add_user():
    print("----------------START----------------")
    try:
        async with AsyncSessionLocal() as db:
            email = "admin@astropinch.com"
            password = "password123"
            
            # Check existing
            result = await db.execute(select(User).filter(User.email == email))
            existing = result.scalars().first()
            if existing:
                print(f"User {email} already exists.")
                return

            new_user = User(email=email, full_name="Admin User", preferred_lang="en")
            db.add(new_user)
            await db.flush()
            
            auth = AuthMethod(
                user_id=new_user.id, 
                provider=AuthProvider.EMAIL, 
                identifier=email, 
                secret_hash=get_password_hash(password)
            )
            db.add(auth)
            await db.commit()
            print(f"User created: {email}")
            print(f"Password: {password}")
            
    except Exception as e:
        print(f"Error creating user: {e}")
    print("----------------END----------------")

if __name__ == "__main__":
    asyncio.run(add_user())
