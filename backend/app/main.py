from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.core.db import Base, engine
from app.routers.api.main import api_router
from app.routers.ws.main import ws_router
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("livecode")

app = FastAPI(
    title="LiveCode",
    description="A Collaborative Real-Time Code Editor for Teams",
    version="1.0.0",
)

origins_list = [origin.strip().rstrip("/") for origin in settings.CORS_ORIGINS.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create all database tables at startup
@app.on_event("startup")
def on_startup():
    logger.info("Starting up...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created")

# Shutdown event
@app.on_event("shutdown")
def on_shutdown():
    logger.info("Shutting down...")


@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Running LiveCode.."}

app.include_router(api_router, prefix="/api")

app.include_router(ws_router, prefix="/ws")
