from fastapi import APIRouter
from app.routers.api import room, ai

api_router = APIRouter()
api_router.include_router(room.router, prefix="/room", tags=["Room"])
api_router.include_router(ai.router, prefix="/ai",tags=["Ai"])