import asyncio
from database import engine
from sqlalchemy import text

async def migrate_db():
    async with engine.begin() as conn:
        print("Migrating Database...")
        
        # 1. Add columns to 'users' if they don't exist
        try:
            await conn.execute(text("ALTER TABLE users ADD COLUMN purchased_slots INTEGER DEFAULT 0"))
            print("Added purchased_slots column")
        except Exception as e:
            print("purchased_slots column likely exists or error:", e)

        try:
            await conn.execute(text("ALTER TABLE users ADD COLUMN total_profiles_created INTEGER DEFAULT 0"))
            print("Added total_profiles_created column")
        except Exception as e:
            print("total_profiles_created column likely exists or error:", e)
            
        # 2. Create 'payments' table
        try:
            await conn.execute(text("""
                CREATE TABLE IF NOT EXISTS payments (
                    id VARCHAR PRIMARY KEY,
                    user_id VARCHAR REFERENCES users(id),
                    amount FLOAT,
                    currency VARCHAR DEFAULT 'INR',
                    status VARCHAR,
                    provider_order_id VARCHAR,
                    provider_payment_id VARCHAR,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )
            """))
            print("Created/Verified payments table")
        except Exception as e:
            print("Error creating payments table:", e)

if __name__ == "__main__":
    import asyncio
    asyncio.run(migrate_db())
