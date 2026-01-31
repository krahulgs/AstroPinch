from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db
from models import Profile, User, AstrologySystem
from schemas import ProfileCreate, ProfileOut, ProfileUpdate
from routers.auth_router import get_current_user
from services.timezone_service import TimezoneService
from typing import List
from datetime import datetime
import uuid

router = APIRouter(
    prefix="/api/profiles",
    tags=["profiles"]
)

@router.get("/", response_model=List[ProfileOut])
async def get_profiles(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Profile).filter(Profile.owner_id == current_user.id))
    profiles = result.scalars().all()
    return profiles

@router.post("/", response_model=ProfileOut)
async def create_profile(
    profile_in: ProfileCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check Profile Limit
    result = await db.execute(select(Profile).filter(Profile.owner_id == current_user.id))
    current_count = len(result.scalars().all())
    
    # Base Limit = 2
    # Total Limit = 2 + (current_user.purchased_slots or 0)
    limit = 2 + (current_user.purchased_slots or 0)
    
    if current_count >= limit:
        raise HTTPException(
            status_code=403,
            detail=f"Profile limit reached ({limit}). Upgrade to create more."
        )

    try:
        # 1. Calculate/Verify Timezone using Service
        date_str = profile_in.birth_date.strftime("%Y-%m-%d")
        time_str = profile_in.birth_time.strftime("%H:%M")
        
        # Parse date time components for historical lookup
        dt = datetime.combine(profile_in.birth_date, profile_in.birth_time)
        
        # Get Timezone Data
        tz_data = TimezoneService.get_timezone_data(
            profile_in.latitude, profile_in.longitude, date_str, time_str
        )
        tz_id = tz_data.get("timezone_id", profile_in.timezone_id or "UTC")
        
        # Try to get precise historical offset using zoneinfo
        h_offset = TimezoneService.calculate_historical_offset(
            tz_id, dt.year, dt.month, dt.day, dt.hour, dt.minute
        )
        
        # If historical calc worked, use it. Else fall back to API current.
        final_offset = h_offset if h_offset != 0 else tz_data.get("utc_offset", profile_in.utc_offset)
        
        # 2. Create Model
        new_profile = Profile(
            owner_id=current_user.id,
            name=profile_in.name,
            gender=profile_in.gender,
            birth_date=profile_in.birth_date,
            birth_time=profile_in.birth_time,
            location_name=profile_in.location_name,
            latitude=profile_in.latitude,
            longitude=profile_in.longitude,
            timezone_id=tz_id,
            utc_offset=final_offset,
            ayanamsa=profile_in.ayanamsa,
            relation=profile_in.relation,
            profession=profile_in.profession,
            marital_status=profile_in.marital_status,
            system=profile_in.system
        )
        
        db.add(new_profile)
        await db.commit()
        await db.refresh(new_profile)
        
        return new_profile
        
    except Exception as e:
        print(f"Profile Create Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{profile_id}")
async def delete_profile(
    profile_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Profile).filter(Profile.id == profile_id, Profile.owner_id == current_user.id)
    )
    profile = result.scalars().first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    await db.delete(profile)
    await db.commit()
    return {"status": "success"}

@router.get("/{profile_id}", response_model=ProfileOut)
async def get_profile(
    profile_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Profile).filter(Profile.id == profile_id, Profile.owner_id == current_user.id)
    )
    profile = result.scalars().first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/{profile_id}", response_model=ProfileOut)
async def update_profile(
    profile_id: str,
    profile_in: ProfileUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Profile).filter(Profile.id == profile_id, Profile.owner_id == current_user.id)
    )
    profile = result.scalars().first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    update_data = profile_in.model_dump(exclude_unset=True)
    
    # Recalculate Timezone if location or time changes
    if any(k in update_data for k in ["latitude", "longitude", "birth_date", "birth_time"]):
        lat = update_data.get("latitude", profile.latitude)
        lng = update_data.get("longitude", profile.longitude)
        b_date = update_data.get("birth_date", profile.birth_date)
        b_time = update_data.get("birth_time", profile.birth_time)
        
        date_str = b_date.strftime("%Y-%m-%d")
        time_str = b_time.strftime("%H:%M")
        dt = datetime.combine(b_date, b_time)
        
        tz_data = TimezoneService.get_timezone_data(lat, lng, date_str, time_str)
        tz_id = tz_data.get("timezone_id", "UTC")
        h_offset = TimezoneService.calculate_historical_offset(
            tz_id, dt.year, dt.month, dt.day, dt.hour, dt.minute
        )
        final_offset = h_offset if h_offset != 0 else tz_data.get("utc_offset", 0)
        
        update_data["timezone_id"] = tz_id
        update_data["utc_offset"] = final_offset

    for field, value in update_data.items():
        setattr(profile, field, value)
        
    await db.commit()
    await db.refresh(profile)
    return profile
