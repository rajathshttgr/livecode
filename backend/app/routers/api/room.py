from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import RoomResponse, SessionResponse, RoomGetResponse
from app.models import Rooms, RoomSessions
from app.core.db import get_db
from app.routers.api.utils import ( get_current_session, generate_room_id, SESSION_COOKIE_NAME)

router = APIRouter() 

@router.post("/session", response_model=SessionResponse)
def session_init(user_session: RoomSessions = Depends(get_current_session)):

    return {"user_name": user_session.user_name,"color": user_session.color}


@router.post("", response_model=RoomResponse)
def create_room(db: Session = Depends(get_db),user_session: RoomSessions = Depends(get_current_session)):
    
    room_id = generate_room_id() 
    
    new_room = Rooms(
        room_id=room_id,
        session_id=user_session.id,
        content=""
    )

    db.add(new_room)
    db.commit()
    db.refresh(new_room)
    
    return {"room_id":new_room.room_id,"content":new_room.content,"created_at":new_room.created_at} 


@router.get("/{room_id}", response_model=RoomGetResponse)
def get_room(room_id: str, db: Session = Depends(get_db)):
    room = db.query(Rooms).filter(Rooms.room_id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    return room