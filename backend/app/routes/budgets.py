from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from fastapi.security import OAuth2PasswordBearer
from fastapi import Security

from app.db import get_db
from app.models.budget import Budget, BudgetCycle
from app.schemas.budget import BudgetCreate, BudgetOut
from app.routes.auth import get_current_user
from app.models.user import User
from app.schemas.auth import UserCreate, UserLogin, Token
from app.utils.hash import hash_password, verify_password
from app.utils.jwt import create_access_token, decode_access_token
from datetime import timedelta
from app.schemas.auth import UserOut


router = APIRouter()

@router.get("", response_model=List[BudgetOut])
def get_budgets(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    budgets = db.query(Budget).filter(Budget.user_id == user.id).all()
    return budgets


@router.post("", response_model=BudgetOut, status_code=status.HTTP_201_CREATED)
def create_budget(budget_in: BudgetCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Optional: allow only one budget per category and cycle per user, or allow multiples
    existing = (
        db.query(Budget)
        .filter(
            Budget.user_id == user.id,
            Budget.category == budget_in.category,
            Budget.cycle == budget_in.cycle,
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=409, detail="Budget for this category and cycle already exists")

    budget = Budget(
        user_id=user.id,
        amount_limit=budget_in.amount_limit,
        cycle=budget_in.cycle,
        category=budget_in.category,
    )
    db.add(budget)
    db.commit()
    db.refresh(budget)
    return budget 