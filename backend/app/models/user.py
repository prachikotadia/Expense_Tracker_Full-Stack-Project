from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from sqlalchemy.orm import relationship
from app.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relations
    #sessions = relationship("Session", back_populates="user", lazy="joined")
    #two_factor = relationship("TwoFactorAuth", uselist=False, back_populates="user")
    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
    budgets = relationship("Budget", back_populates="user", cascade="all, delete-orphan")
    reminders = relationship("Reminder", back_populates="user", cascade="all, delete-orphan")
    #notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    #export_logs = relationship("ExportLog", back_populates="user", cascade="all, delete-orphan")
    #family_memberships = relationship("FamilyMember", back_populates="user", cascade="all, delete-orphan")
    #password_reset_tokens = relationship("PasswordResetToken", back_populates="user", cascade="all, delete-orphan")
    #audit_logs = relationship("AuditLog", back_populates="user", cascade="all, delete-orphan") 