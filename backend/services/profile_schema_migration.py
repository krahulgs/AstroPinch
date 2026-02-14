
from sqlalchemy import text

async def add_profile_columns(db_session_factory):
    print("Checking for profile columns (photo_url)...")
    async with db_session_factory() as db:
        try:
            # Try to query the column to see if it exists
            await db.execute(text("SELECT photo_url FROM users LIMIT 1"))
            print("Profile columns (photo_url) already exist.")
        except Exception:
            print("Profile columns missing. Initializing schema update...")
            try:
                # Add photo_url
                await db.execute(text("ALTER TABLE users ADD COLUMN photo_url VARCHAR"))
                print("Added photo_url column.")
            except Exception as e:
                 print(f"Error adding photo_url: {e}")

            await db.commit()
            print("Profile schema update complete.")
