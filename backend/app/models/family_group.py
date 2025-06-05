from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.db import Base


class FamilyGroup(Base):
    __tablename__ = "family_groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    members = relationship("FamilyMember", back_populates="family_group", cascade="all, delete-orphan") 