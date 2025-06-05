from sqlalchemy import Column, Integer, ForeignKey, DateTime, func, Boolean
from sqlalchemy.orm import relationship
from app.db import Base


class FamilyMember(Base):
    __tablename__ = "family_members"

    id = Column(Integer, primary_key=True, index=True)
    family_group_id = Column(Integer, ForeignKey("family_groups.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    is_admin = Column(Boolean, default=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())

    family_group = relationship("FamilyGroup", back_populates="members")
    user = relationship("User", back_populates="family_memberships") 