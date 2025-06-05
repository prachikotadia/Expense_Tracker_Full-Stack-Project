from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.db import get_db
from app.models.transaction import Transaction, TransactionType
from app.schemas.transaction import TransactionCreate, TransactionOut, TransactionUpdate
from app.routes.auth import get_current_user
from app.models.user import User

router = APIRouter()


@router.get("", response_model=List[TransactionOut])
def list_transactions(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    category: Optional[str] = Query(None),
    type: Optional[TransactionType] = Query(None),
):
    query = db.query(Transaction).filter(Transaction.user_id == user.id)
    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)
    if category:
        query = query.filter(Transaction.category == category)
    if type:
        query = query.filter(Transaction.type == type)

    transactions = query.order_by(Transaction.date.desc()).all()
    return transactions


@router.post("", response_model=TransactionOut, status_code=status.HTTP_201_CREATED)
def add_transaction(transaction_in: TransactionCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    transaction = Transaction(
        user_id=user.id,
        amount=transaction_in.amount,
        category=transaction_in.category,
        type=transaction_in.type,
        description=transaction_in.description,
        date=transaction_in.date or None,
    )
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


@router.put("/{transaction_id}", response_model=TransactionOut)
def edit_transaction(
    transaction_id: int,
    transaction_in: TransactionUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.user_id == user.id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    for attr, value in transaction_in.dict(exclude_unset=True).items():
        setattr(transaction, attr, value)
    db.commit()
    db.refresh(transaction)
    return transaction


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(transaction_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.user_id == user.id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    db.delete(transaction)
    db.commit()
    return None 