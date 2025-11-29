import redis.asyncio as redis
from app.core.config import settings

REDIS_URL = f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/0"

pool = redis.ConnectionPool.from_url(REDIS_URL, decode_responses=True)

async def get_redis():

    client = redis.Redis(connection_pool=pool)
    try:
        yield client
    finally:
        await client.close()