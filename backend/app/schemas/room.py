from pydantic import BaseModel
from datetime import datetime

class SessionResponse(BaseModel):
    user_name: str
    color: str

    class Config:
        from_attributes = True

class RoomCreate(BaseModel):
    pass 

class RoomResponse(BaseModel):
    room_id: str
    content: str = ""
    created_at: datetime

    class Config:
        from_attributes = True

class RoomGetResponse(BaseModel):
    content: str
    session_id: str
    created_at: datetime
    updated_at: datetime | None = None
    room_id: str
    id: str

    class Config:
        from_attributes = True
