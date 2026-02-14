
from sqlalchemy import text

async def add_reset_columns(db_session_factory):
    print("Checking for password reset columns...")
    async with db_session_factory() as db:
        try:
            # Try to query the column to see if it exists
            await db.execute(text("SELECT reset_token FROM users LIMIT 1"))
            print("Reset columns already exist.")
        except Exception:
            print("Reset columns missing. Initializing schema update...")
            # If query fails, columns likely don't exist. Add them.
            # Transactions are tricky with DDL in some engines, but usually fine here.
            try:
                # Add reset_token
                await db.execute(text("ALTER TABLE users ADD COLUMN reset_token VARCHAR"))
                print("Added reset_token column.")
            except Exception as e:
                 print(f"Error adding reset_token: {e}")

            try:
                # Add reset_token_expires
                # Use TIMESTAMP for broad compatibility (SQLite treats as string/numeric, PG as timestamp)
                await db.execute(text("ALTER TABLE users ADD COLUMN reset_token_expires TIMESTAMP"))
                print("Added reset_token_expires column.")
            except Exception as e:
                 print(f"Error adding reset_token_expires: {e}")

            await db.commit()
            print("Schema update complete.")
