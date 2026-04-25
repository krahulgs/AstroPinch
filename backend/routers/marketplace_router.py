from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from database import AsyncSessionLocal
from models import Astrologer, Wallet, WalletTransaction, Consultation, User, Review
from typing import List, Optional
import datetime
import uuid

router = APIRouter(prefix="/api/marketplace", tags=["Marketplace"])

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

@router.get("/astrologers")
async def get_astrologers(
    specialization: Optional[str] = None,
    language: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Astrologer).where(Astrologer.verification_status == "APPROVED")
    result = await db.execute(query)
    astrologers = result.scalars().all()
    
    # Simple in-memory filtering for specialized JSON fields
    if specialization:
        astrologers = [a for a in astrologers if specialization in (a.specializations or [])]
    if language:
        astrologers = [a for a in astrologers if language in (a.languages or [])]
        
    return astrologers

@router.get("/astrologers/{astrologer_id}")
async def get_astrologer_detail(astrologer_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Astrologer).where(Astrologer.id == astrologer_id)
    )
    astrologer = result.scalars().first()
    if not astrologer:
        raise HTTPException(status_code=404, detail="Astrologer not found")
    
    # Include reviews
    review_result = await db.execute(
        select(Review).where(Review.astrologer_id == astrologer_id)
    )
    reviews = review_result.scalars().all()
    
    return {
        "profile": astrologer,
        "reviews": reviews
    }

@router.get("/wallet/balance/{user_id}")
async def get_wallet_balance(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Wallet).where(Wallet.user_id == user_id)
    )
    wallet = result.scalars().first()
    if not wallet:
        # Auto-create wallet if missing
        wallet = Wallet(user_id=user_id, balance=0.0)
        db.add(wallet)
        await db.commit()
        await db.refresh(wallet)
        
    return {"balance": wallet.balance, "currency": wallet.currency}

@router.post("/wallet/topup")
async def topup_wallet(user_id: str, amount: float, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Wallet).where(Wallet.user_id == user_id)
    )
    wallet = result.scalars().first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    
    wallet.balance += amount
    
    transaction = WalletTransaction(
        wallet_id=wallet.id,
        amount=amount,
        type="CREDIT",
        description="Wallet Top-up (Simulated)"
    )
    db.add(transaction)
    await db.commit()
    
    return {"status": "success", "new_balance": wallet.balance}

@router.post("/consultation/start")
async def start_consultation(
    user_id: str, 
    astrologer_id: str, 
    type: str = "CHAT", 
    db: AsyncSession = Depends(get_db)
):
    # Check if astrologer is online and not busy
    result = await db.execute(
        select(Astrologer).where(Astrologer.id == astrologer_id)
    )
    astrologer = result.scalars().first()
    if not astrologer or not astrologer.is_online or astrologer.is_busy:
        raise HTTPException(status_code=400, detail="Astrologer is currently unavailable")
        
    # Check user balance (minimum 5 mins)
    wallet_result = await db.execute(
        select(Wallet).where(Wallet.user_id == user_id)
    )
    wallet = wallet_result.scalars().first()
    if not wallet or wallet.balance < (astrologer.price_per_min * 5):
        # Allow first 5 minutes free for new users (simplified logic)
        # Check if user has had any completed consultations
        cons_result = await db.execute(
            select(Consultation).where(Consultation.user_id == user_id, Consultation.status == "COMPLETED")
        )
        has_history = cons_result.scalars().first()
        if has_history:
            raise HTTPException(status_code=400, detail="Insufficient balance. Minimum 5 minutes required.")
        else:
            print(f"[Marketplace] Granting free first session to user {user_id}")

    # Mark astrologer as busy
    astrologer.is_busy = True
    
    consultation = Consultation(
        user_id=user_id,
        astrologer_id=astrologer_id,
        type=type,
        status="ACTIVE",
        start_time=datetime.datetime.utcnow(),
        cost_per_min=astrologer.price_per_min
    )
    db.add(consultation)
    await db.commit()
    await db.refresh(consultation)
    
    return consultation

@router.post("/consultation/{consultation_id}/end")
async def end_consultation(consultation_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Consultation).where(Consultation.id == consultation_id)
    )
    consultation = result.scalars().first()
    if not consultation or consultation.status != "ACTIVE":
        raise HTTPException(status_code=404, detail="Active consultation not found")
    
    consultation.end_time = datetime.datetime.utcnow()
    duration = (consultation.end_time - consultation.start_time).total_seconds() / 60
    consultation.duration_minutes = int(max(1, duration))
    
    # Billing logic
    # Check for free 5-minute conversion
    cons_history = await db.execute(
        select(Consultation).where(
            Consultation.user_id == consultation.user_id, 
            Consultation.id != consultation_id,
            Consultation.status == "COMPLETED"
        )
    )
    is_first_session = not cons_history.scalars().first()
    
    billable_minutes = consultation.duration_minutes
    if is_first_session:
        billable_minutes = max(0, consultation.duration_minutes - 5)
        
    consultation.total_cost = billable_minutes * consultation.cost_per_min
    consultation.status = "COMPLETED"
    
    # Deduct from wallet
    wallet_result = await db.execute(
        select(Wallet).where(Wallet.user_id == consultation.user_id)
    )
    wallet = wallet_result.scalars().first()
    if wallet and consultation.total_cost > 0:
        wallet.balance -= consultation.total_cost
        transaction = WalletTransaction(
            wallet_id=wallet.id,
            amount=consultation.total_cost,
            type="DEBIT",
            description=f"Consultation with Astrologer {consultation.astrologer_id}"
        )
        db.add(transaction)
    
    # Release astrologer
    astro_result = await db.execute(
        select(Astrologer).where(Astrologer.id == consultation.astrologer_id)
    )
    astrologer = astro_result.scalars().first()
    if astrologer:
        astrologer.is_busy = False
        
    await db.commit()
    
    return {
        "status": "COMPLETED",
        "duration": consultation.duration_minutes,
        "cost": consultation.total_cost,
        "new_balance": wallet.balance if wallet else 0
    }
