from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, func, Enum
from sqlalchemy.orm import relationship
from app.db import Base
import enum


class BudgetCycle(str, enum.Enum):
    monthly = "monthly"
    weekly = "weekly"


class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    amount_limit = Column(Float, nullable=False)
    cycle = Column(Enum(BudgetCycle), nullable=False)
    category = Column(String(100), nullable=True)  # Optional category-specific budget
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="budgets") 