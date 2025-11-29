from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from app.core.db import Base
import uuid


class RoomSessions(Base):
    __tablename__ = "room_sessions"

    id = Column(String(64), primary_key=True)
    user_name = Column(String(50), nullable=False)
    color = Column(String(10), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    

class Rooms(Base):
    __tablename__ = "rooms"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    room_id = Column(String(16), unique=True, nullable=False) 
    session_id = Column(String(64), ForeignKey("room_sessions.id"), nullable=False, index=True)
    content = Column(Text, nullable=True, default="")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

