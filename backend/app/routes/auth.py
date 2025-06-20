from fastapi import APIRouter, Depends, HTTPException, status, Request, Security
from sqlalchemy.orm import Session
from app.schemas.auth import UserCreate, UserLogin, Token, UserOut, ChangePasswordRequest, ForgotPasswordRequest, ResetPasswordRequest
from app.utils.hash import hash_password, verify_password
from app.db import get_db
from app.models.user import User
from app.utils.jwt import create_access_token, decode_access_token
from fastapi.security import APIKeyHeader
from typing import Optional
from datetime import timedelta, datetime
import uuid

router = APIRouter()

# Use APIKeyHeader for Bearer token authentication in Swagger UI
api_key_header = APIKeyHeader(name="Authorization")

def get_current_user(token: str = Security(api_key_header), db: Session = Depends(get_db)):
    if not token.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or missing Bearer token")
    jwt_token = token.split(" ", 1)[1]
    try:
        payload = decode_access_token(jwt_token)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    print("🔥 Register called with:", user_in.dict())
    
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        print("🚫 Email already exists:", user_in.email)
        raise HTTPException(status_code=400, detail="Email already registered")

    try:
        new_user = User(
            email=user_in.email,
            hashed_password=hash_password(user_in.password),
            is_active=True,
            is_superuser=False
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        print("✅ User created:", new_user)
        return new_user
    except Exception as e:
        print("❌ Error during register:", e)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    # Create JWT token with user id as subject
    access_token = create_access_token(data={"sub": str(user.id)})

    return Token(access_token=access_token)

@router.post("/logout")
def logout(current_user: str = Depends(get_current_user)):
    # Token revocation implementation can be done here:
    # For simplicity, you can implement blocklist session based on JWT jti
    return {"msg": "Logout endpoint placeholder - implement token revocation"}

@router.get("/me", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/change-password", status_code=status.HTTP_204_NO_CONTENT)
def change_password(data: ChangePasswordRequest, current_user: User = Depends(), db: Session = Depends(get_db)):
    if not verify_password(data.old_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Old password incorrect")

    current_user.hashed_password = hash_password(data.new_password)
    db.add(current_user)
    db.commit()
    return None

@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    # TODO: Generate reset token, send email with reset link
    return {"msg": "Password reset link sent if email exists"}

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    # TODO: Validate token, set new password
    return {"msg": "Password has been reset successfully"}

router.dependencies.append(Depends(get_current_user)) 