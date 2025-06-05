from pydantic import BaseModel, EmailStr
from typing import List, Optional


class FamilyCreate(BaseModel):
    name: str


class FamilyInvite(BaseModel):
    family_group_id: int
    email: EmailStr


class FamilyMemberOut(BaseModel):
    id: int
    family_group_id: int
    user_id: int
    is_admin: bool

    class Config:
        orm_mode = True 