import asyncio
from sqlalchemy.future import select
from models import Astrologer, Wallet, User
from database import AsyncSessionLocal, Base, engine

async def init_marketplace():
    """
    Ensures all marketplace tables are created and seeds initial dummy data.
    """
    print("[Marketplace Migration] Starting...")
    
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with AsyncSessionLocal() as session:
        # 1. Seed Dummy Astrologers if none exist
        result = await session.execute(select(Astrologer))
        if not result.scalars().first():
            print("[Marketplace Migration] Seeding dummy astrologers...")
            dummy_astrologers = [
                Astrologer(
                    full_name="Acharya Rahul",
                    photo_url="https://images.unsplash.com/photo-1544168190-79c17527004f?w=400",
                    bio="Expert in Vedic Astrology and Nadi Jyotish with 15+ years of experience.",
                    specializations=["Vedic", "Nadi", "Gemology"],
                    languages=["Hindi", "English"],
                    experience_years=15,
                    rating_avg=4.8,
                    rating_count=1240,
                    price_per_min=25.0,
                    is_online=True,
                    is_verified=True,
                    verification_status="APPROVED"
                ),
                Astrologer(
                    full_name="Dr. Sunita Sharma",
                    photo_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
                    bio="Renowned Numerologist and Vastu Consultant.",
                    specializations=["Numerology", "Vastu", "Palmistry"],
                    languages=["Hindi", "Punjabi", "English"],
                    experience_years=10,
                    rating_avg=4.9,
                    rating_count=850,
                    price_per_min=35.0,
                    is_online=True,
                    is_verified=True,
                    verification_status="APPROVED"
                ),
                Astrologer(
                    full_name="Pandit Vishwanath",
                    photo_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
                    bio="Traditional Vedic Scholar specializing in Muhurat and Matchmaking.",
                    specializations=["Vedic", "Muhurat", "Matchmaking"],
                    languages=["Sanskrit", "Hindi", "Marathi"],
                    experience_years=25,
                    rating_avg=4.7,
                    rating_count=3200,
                    price_per_min=15.0,
                    is_online=False,
                    is_verified=True,
                    verification_status="APPROVED"
                )
            ]
            session.add_all(dummy_astrologers)
            await session.commit()
            print("[Marketplace Migration] Seeded 3 astrologers.")
        
        # 2. Ensure all existing users have a Wallet
        result = await session.execute(select(User))
        users = result.scalars().all()
        for user in users:
            wallet_result = await session.execute(select(Wallet).where(Wallet.user_id == user.id))
            if not wallet_result.scalars().first():
                new_wallet = Wallet(user_id=user.id, balance=0.0)
                session.add(new_wallet)
        
        await session.commit()
        print("[Marketplace Migration] Wallet check completed.")

if __name__ == "__main__":
    asyncio.run(init_marketplace())
