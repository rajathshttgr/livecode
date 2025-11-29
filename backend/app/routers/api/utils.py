from fastapi import Request, Response, Depends
from sqlalchemy.orm import Session
from app.models import RoomSessions
from app.core.db import get_db
import random
import string
import uuid

ANON_NAMES = [
    "Astronaut", "Explorer", "Neuron", "Pixel", "Spectrum",
    "Comet", "Voyager", "Mystic", "Nimbus", "Photon",
    "Quantum", "Zenith", "Drifter", "Nomad", "Orbit",
    "Vector", "Cosmic", "Dominor", "Horizon", "Seraph",
    "Rune", "Circuit", "Mirage", "Signal", "Nimbus"
]

def generate_anonymous_name():
    name = random.choice(ANON_NAMES)
    suffix = random.randint(100, 999)  
    return f"{name}_{suffix}"


USER_COLORS = [
    "#FF5733", "#33FF57", "#3357FF", "#F033FF", "#FF33A8",
    "#33FFF5", "#F5FF33", "#FF8C33", "#8C33FF", "#33FF8C",
    "#FF3333", "#33FF33", "#3333FF", "#FF33FF", "#33FFFF",
]

def generate_random_color():
    return random.choice(USER_COLORS)

def generate_room_id(length: int = 8):
    chars = string.ascii_uppercase + string.digits
    return ''.join(random.choices(chars, k=length))

def generate_session_id():
    return str(uuid.uuid4())


SESSION_COOKIE_NAME = "user_session_id"

def get_or_create_session_db(db: Session, session_id: str | None) -> RoomSessions:
    if session_id:
        existing_session = db.query(RoomSessions).filter(RoomSessions.id == session_id).first()
        if existing_session:
            return existing_session

    new_session = RoomSessions(
        id=generate_session_id(),
        user_name=generate_anonymous_name(),
        color=generate_random_color()
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    
    return new_session


def get_current_session(request: Request, response: Response, db: Session = Depends(get_db)) -> RoomSessions:
    
    incoming_id = request.cookies.get(SESSION_COOKIE_NAME)
    
    user_session = get_or_create_session_db(db, incoming_id)

    if incoming_id != user_session.id:
        response.set_cookie(
            key=SESSION_COOKIE_NAME,
            value=user_session.id,
            httponly=True,
            max_age=60 * 60 * 24 * 7,
            samesite="lax", 
            secure=False
        )
        
    return user_session