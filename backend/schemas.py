from pydantic import BaseModel, EmailStr
from datetime import date, time, datetime
from typing import Optional, List
from models import AuthProvider, AstrologySystem

class ProfileBase(BaseModel):
    name: str
    gender: Optional[str] = "male"
    birth_date: date
    birth_time: time
    latitude: float
    longitude: float
    location_name: str
    timezone_id: Optional[str] = None
    utc_offset: float = 0.0
    ayanamsa: str = "Lahiri"
    relation: str = "Self"
    profession: Optional[str] = None
    marital_status: Optional[str] = None
    system: AstrologySystem = AstrologySystem.BOTH
    
    # Alert Configuration
    phone_number: Optional[str] = None
    alert_daily: bool = False
    alert_weekly: bool = False
    alert_monthly: bool = False
    alert_active: bool = True

    class Config:
        from_attributes = True

class ProfileCreate(ProfileBase):
    pass

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    gender: Optional[str] = None
    birth_date: Optional[date] = None
    birth_time: Optional[time] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_name: Optional[str] = None
    timezone_id: Optional[str] = None
    utc_offset: Optional[float] = None
    ayanamsa: Optional[str] = None
    relation: Optional[str] = None
    profession: Optional[str] = None
    marital_status: Optional[str] = None
    system: Optional[AstrologySystem] = None
    
    # Alert Configuration
    phone_number: Optional[str] = None
    alert_daily: Optional[bool] = None
    alert_weekly: Optional[bool] = None
    alert_monthly: Optional[bool] = None
    alert_active: Optional[bool] = None

class ProfileOut(ProfileBase):
    id: str
    owner_id: str
    created_at: datetime

class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    full_name: str
    preferred_lang: str = "en"

class UserOut(UserBase):
    id: str
    is_active: bool
    purchased_slots: int = 0
    created_at: datetime

    class Config:
        from_attributes = True
