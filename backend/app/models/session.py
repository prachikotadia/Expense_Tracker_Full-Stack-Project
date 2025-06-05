from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func, Boolean
from sqlalchemy.orm import relationship
from app.db import Base


class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    jti = Column(String(255), unique=True, nullable=False)  # JWT token ID for revocation
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expired_at = Column(DateTime(timezone=True), nullable=True)
    ip_address = Column(String(45), nullable=True)  # IPv6 compatible
    user_agent = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)

    user = relationship("User", back_populates="sessions") 