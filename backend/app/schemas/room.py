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

