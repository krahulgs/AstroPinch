from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db
from models import User, AuthMethod, AuthProvider, AstrologySystem
from auth_utils import create_access_token, verify_password, get_password_hash, decode_access_token
from typing import List, Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
import secrets
from services.email_service import send_reset_email
import os
import shutil

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    preferred_lang: str = "en"

class Token(BaseModel):
    access_token: str
    token_type: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalars().first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/register", response_model=Token)
async def register(user_in: UserRegister, db: AsyncSession = Depends(get_db)):
    # Check if user already exists
    user_in.email = user_in.email.lower()
    result = await db.execute(select(User).filter(User.email == user_in.email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create User
    new_user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        preferred_lang=user_in.preferred_lang
    )
    db.add(new_user)
    await db.flush()
    
    # Create Auth Method
    auth = AuthMethod(
        user_id=new_user.id,
        provider=AuthProvider.EMAIL,
        identifier=user_in.email,
        secret_hash=get_password_hash(user_in.password)
    )
    db.add(auth)
    
    await db.commit()
    
    access_token = create_access_token(data={"sub": new_user.id})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    form_data.username = form_data.username.lower()
    result = await db.execute(
        select(AuthMethod).filter(
            AuthMethod.identifier == form_data.username,
            AuthMethod.provider == AuthProvider.EMAIL
        )
    )
    auth = result.scalars().first()
    if not auth or not verify_password(form_data.password, auth.secret_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": auth.user_id})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
async def read_users_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "preferred_lang": current_user.preferred_lang,
        "phone_number": current_user.phone,
        "photo_url": current_user.photo_url
    }

class ProfileUpdate(BaseModel):
    phone_number: Optional[str] = None
    full_name: Optional[str] = None

@router.put("/update-profile")
async def update_profile(profile_update: ProfileUpdate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if profile_update.phone_number is not None:
        current_user.phone = profile_update.phone_number
    if profile_update.full_name is not None:
        current_user.full_name = profile_update.full_name
        
    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return {"message": "Profile updated successfully"}

@router.post("/upload-photo")
async def upload_photo(photo: UploadFile = File(...), current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    UPLOAD_DIR = "uploads"
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)
        
    file_extension = os.path.splitext(photo.filename)[1]
    filename = f"{current_user.id}_{int(datetime.utcnow().timestamp())}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(photo.file, buffer)
        
    # Return relative URL
    current_user.photo_url = f"/uploads/{filename}"
    db.add(current_user)
    await db.commit()
    
    return {"photo_url": current_user.photo_url}

# Forgot Password Endpoint
@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == request.email.lower()))
    user = result.scalars().first()
    
    if not user:
        # Don't reveal user existence, return success anyway (security best practice)
        return {"message": "If email exists, reset link sent."}
    
    # Generate token
    token = secrets.token_urlsafe(32)
    user.reset_token = token
    user.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
    
    db.add(user)
    await db.commit()
    
    # Send email (Mock service prints to console)
    await send_reset_email(user.email, token)
    
    return {"message": "Reset link sent to email."}

# Reset Password Endpoint
@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.reset_token == request.token))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=400, detail="Invalid token")
        
    if user.reset_token_expires < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token expired")
        
    # Find Auth Method (Email provider)
    # We need to query auth_methods explicitly or assume related
    # Since existing user usually has it.
    auth_result = await db.execute(select(AuthMethod).filter(
        AuthMethod.user_id == user.id, 
        AuthMethod.provider == AuthProvider.EMAIL
    ))
    auth_method = auth_result.scalars().first()
    
    if not auth_method:
         raise HTTPException(status_code=400, detail="No email login associated with account")
         
    # Update Password
    auth_method.secret_hash = get_password_hash(request.new_password)
    
    # Clear token
    user.reset_token = None
    user.reset_token_expires = None
    
    db.add(auth_method)
    db.add(user)
    await db.commit()
    
    return {"message": "Password reset successfully"}
