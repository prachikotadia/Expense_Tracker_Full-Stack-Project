from pydantic import BaseModel, constr
from typing import Optional
from datetime import datetime


class ReminderBase(BaseModel):
    title: constr(max_length=255)
    description: Optional[constr(max_length=1024)] = None
    remind_at: datetime


class ReminderCreate(ReminderBase):
    pass


class ReminderOut(ReminderBase):
    id: int
    is_completed: bool

    class Config:
        orm_mode = True 