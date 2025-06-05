from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db import get_db
from app.models.reminder import Reminder
from app.schemas.reminder import ReminderCreate, ReminderOut
from app.routes.auth import get_current_user
from app.models.user import User

router = APIRouter()


@router.post("", response_model=ReminderOut, status_code=status.HTTP_201_CREATED)
def add_reminder(reminder_in: ReminderCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    reminder = Reminder(
        user_id=user.id,
        title=reminder_in.title,
        description=reminder_in.description,
        remind_at=reminder_in.remind_at,
    )
    db.add(reminder)
    db.commit()
    db.refresh(reminder)
    return reminder


@router.get("", response_model=List[ReminderOut])
def list_reminders(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    reminders = db.query(Reminder).filter(Reminder.user_id == user.id).order_by(Reminder.remind_at).all()
    return reminders


@router.delete("/{reminder_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reminder(reminder_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    reminder = db.query(Reminder).filter(Reminder.id == reminder_id, Reminder.user_id == user.id).first()
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    db.delete(reminder)
    db.commit()
    return None 