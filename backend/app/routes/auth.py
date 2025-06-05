from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.schemas.auth import UserCreate, UserLogin, Token, UserOut, ChangePasswordRequest, ForgotPasswordRequest, ResetPasswordRequest
from app.utils.hash import hash_password, verify_password
from app.db import get_db
from app.models.user import User
from app.utils.jwt import create_access_token, decode_access_token
from datetime import timedelta, datetime
import uuid

router = APIRouter()


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
        is_active=True,
        is_superuser=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=Token)
def login(user_in: UserLogin, request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    # Create JWT token with user id as subject
    access_token = create_access_token(subject=str(user.id))

    # Store session - save jti (JWT ID)
    jti = str(uuid.uuid4())
    from app.models.session import Session as SessionModel
    expires_at = datetime.utcnow() + timedelta(minutes=60 * 24 * 7)
    client_host = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    db_session = SessionModel(
        user_id=user.id,
        jti=jti,
        created_at=datetime.utcnow(),
        expired_at=expires_at,
        ip_address=client_host,
        user_agent=user_agent,
        is_active=True,
    )
    db.add(db_session)
    db.commit()

    # Return token with jti embedded as claim if implementing token revocation details
    # Currently token only has user.id in sub, could add jti in future.

    return Token(access_token=access_token)


@router.post("/logout")
def logout(token: str = Depends()):
    # Token revocation implementation can be done here:
    # For simplicity, you can implement blocklist session based on JWT jti
    return {"msg": "Logout endpoint placeholder - implement token revocation"}


@router.get("/me", response_model=UserOut)
def get_profile(current_user: User = Depends()):
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


# Dependency to get current user from JWT token
from fastapi.security import OAuth2PasswordBearer
from fastapi import Security
from app.db import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(token: str = Security(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = decode_access_token(token)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


router.dependencies.append(Depends(get_current_user)) 