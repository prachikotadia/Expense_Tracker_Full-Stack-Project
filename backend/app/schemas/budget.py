from pydantic import BaseModel, constr
from enum import Enum
from typing import Optional


class BudgetCycle(str, Enum):
    monthly = "monthly"
    weekly = "weekly"


class BudgetBase(BaseModel):
    amount_limit: float
    cycle: BudgetCycle
    category: Optional[constr(strip_whitespace=True, max_length=100)] = None


class BudgetCreate(BudgetBase):
    pass


class BudgetOut(BudgetBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True 