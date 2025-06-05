from pydantic import BaseModel, EmailStr, constr
from typing import Optional


class UserCreate(BaseModel):
    email: EmailStr
    password: constr(min_length=8)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    is_active: bool

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: int
    exp: int


class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: constr(min_length=8)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: constr(min_length=8) 