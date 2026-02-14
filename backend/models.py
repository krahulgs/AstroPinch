import sqlalchemy
from sqlalchemy import Column, String, Float, DateTime, Boolean, Date, Time, ForeignKey, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
import uuid
import enum

class AuthProvider(enum.Enum):
    EMAIL = "email"
    GOOGLE = "google"
    APPLE = "apple"
    OTP = "otp"

class PaymentStatus(enum.Enum):
    PENDING = "PENDING"
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"

class AstrologySystem(enum.Enum):
    VEDIC = "VEDIC"
    WESTERN = "WESTERN"
    BOTH = "BOTH"

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=True)
    phone = Column(String, unique=True, index=True, nullable=True)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    preferred_lang = Column(String, default="en")
    photo_url = Column(String, nullable=True)
    
    # Profile Limits
    purchased_slots = Column(sqlalchemy.Integer, default=0)
    total_profiles_created = Column(sqlalchemy.Integer, default=0) # Analytics
    
    auth_methods = relationship("AuthMethod", back_populates="user", cascade="all, delete-orphan")
    profiles = relationship("Profile", back_populates="owner", cascade="all, delete-orphan")
    sessions = relationship("UserSession", back_populates="user", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="user", cascade="all, delete-orphan")

class AuthMethod(Base):
    __tablename__ = "auth_methods"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(ForeignKey("users.id"))
    provider = Column(SQLEnum(AuthProvider))
    identifier = Column(String, index=True) # email or phone
    secret_hash = Column(String, nullable=True) # hashed password or oauth token
    
    user = relationship("User", back_populates="auth_methods")

class Profile(Base):
    __tablename__ = "profiles"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    owner_id = Column(ForeignKey("users.id"))
    name = Column(String)
    gender = Column(String) # male, female, non-binary, other
    birth_date = Column(Date)
    birth_time = Column(Time)
    latitude = Column(Float)
    longitude = Column(Float)
    location_name = Column(String)
    timezone_id = Column(String)
    utc_offset = Column(Float, default=0.0)
    ayanamsa = Column(String, default="Lahiri")
    relation = Column(String, default="Self")
    profession = Column(String, nullable=True)
    marital_status = Column(String, nullable=True)
    system = Column(SQLEnum(AstrologySystem), default=AstrologySystem.BOTH)
    
    # Alert Configuration
    phone_number = Column(String, nullable=True)
    alert_daily = Column(Boolean, default=False)
    alert_weekly = Column(Boolean, default=False)
    alert_monthly = Column(Boolean, default=False)
    alert_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    owner = relationship("User", back_populates="profiles")

class UserSession(Base):
    __tablename__ = "sessions"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(ForeignKey("users.id"))
    device_id = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)
    
    expires_at = Column(DateTime)
    
    user = relationship("User", back_populates="sessions")

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(ForeignKey("users.id"))
    amount = Column(Float)
    currency = Column(String, default="INR")
    status = Column(SQLEnum(PaymentStatus), default=PaymentStatus.PENDING)
    provider_order_id = Column(String, nullable=True)
    provider_payment_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="payments")
