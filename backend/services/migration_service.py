
from sqlalchemy.future import select
from models import User, AuthMethod
import traceback

async def migrate_emails_to_lowercase(db_session_factory):
    """
    Migrates all user emails and auth identifiers to lowercase to Ensure case-insensitive login.
    Run this on startup.
    """
    print("Starting email migration to lowercase...")
    try:
        async with db_session_factory() as db:
            # Users
            res = await db.execute(select(User))
            users = res.scalars().all()
            for u in users:
                if u.email and u.email != u.email.lower():
                    print(f"Migrating User: {u.email} -> {u.email.lower()}")
                    u.email = u.email.lower()
            
            # AuthMethods
            res = await db.execute(select(AuthMethod))
            auths = res.scalars().all()
            for a in auths:
                if a.identifier and a.identifier != a.identifier.lower():
                    print(f"Migrating Auth: {a.identifier} -> {a.identifier.lower()}")
                    a.identifier = a.identifier.lower()
            
            await db.commit()
            print("Email migration complete.")
    except Exception as e:
        print(f"Migration error (likely duplicate, skipping): {e}")
