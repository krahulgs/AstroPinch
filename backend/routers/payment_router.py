from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from models import User, Payment, PaymentStatus
from routers.auth_router import get_current_user
from pydantic import BaseModel
import uuid
import datetime

router = APIRouter(
    prefix="/api/payments",
    tags=["payments"]
)

class OrderCreate(BaseModel):
    amount: float = 101.0
    currency: str = "INR"

class PaymentVerify(BaseModel):
    order_id: str
    payment_id: str

@router.post("/create-order")
async def create_order(
    order_in: OrderCreate,
    current_user: User = Depends(get_current_user)
):
    mock_order_id = f"order_{uuid.uuid4().hex[:10]}"
    return {
        "id": mock_order_id,
        "currency": order_in.currency,
        "amount": order_in.amount,
        "key": "rzp_test_MOCK_KEY"
    }

@router.post("/verify")
async def verify_payment(
    payment_in: PaymentVerify,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # 1. Update User's Purchased Slots
        # Assuming 101 INR = 1 Slot. Ideally logic based on amount.
        # For this feature, any success payment adds 1 slot (or make it unlimited?)
        # Requirement: "Paid Profile Unlock... From 3rd profile onward... Unlocked profiles remain permanently"
        # Since the requirement implies "pay per profile" (or bundle), let's assume 1 slot per payment for now.
        # "Allow users to unlock: Single profile (₹101 each)"
        
        current_user.purchased_slots += 1
        
        # 2. Record Transaction
        new_payment = Payment(
            user_id=current_user.id,
            amount=101.0,
            currency="INR",
            status=PaymentStatus.SUCCESS,
            provider_order_id=payment_in.order_id,
            provider_payment_id=payment_in.payment_id,
            created_at=datetime.datetime.utcnow()
        )
        
        db.add(new_payment)
        await db.commit()
        await db.refresh(current_user)
        
        return {"status": "success", "new_slot_count": current_user.purchased_slots}
        
    except Exception as e:
        print(f"Payment Verification Failed: {e}")
        raise HTTPException(status_code=500, detail="Payment verification failed")
