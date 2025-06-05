from pydantic import BaseModel, constr
from datetime import datetime
from typing import Optional
from enum import Enum


class TransactionType(str, Enum):
    income = "income"
    expense = "expense"


class TransactionBase(BaseModel):
    amount: float
    category: constr(strip_whitespace=True, max_length=100)
    type: TransactionType
    description: Optional[constr(max_length=255)] = None
    date: Optional[datetime] = None


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    amount: Optional[float]
    category: Optional[constr(strip_whitespace=True, max_length=100)]
    type: Optional[TransactionType]
    description: Optional[constr(max_length=255)]
    date: Optional[datetime]


class TransactionOut(TransactionBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True 