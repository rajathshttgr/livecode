from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query
from app.services.manager import manager
from app.core.redis import get_redis
import redis.asyncio as redis
import json

ws_router = APIRouter()

@ws_router.websocket("/room/{room_id}")
async def code_editor_endpoint(
    websocket: WebSocket, 
    room_id: str, 
    user_name: str = Query(...), 
    color: str = Query(...),     
    r: redis.Redis = Depends(get_redis)
):
    try:
        user_info = {"name": user_name, "color": color}

        await manager.connect(websocket, room_id, user_info, r)

        redis_key_code = f"room:{room_id}"
        current_content = await r.get(redis_key_code)

        content_str = current_content if current_content else "// Start coding here..."
        
        await websocket.send_text(json.dumps({
            "type": "INIT",
            "payload": content_str
        }))

        await manager.broadcast_user_list(room_id, r)

        while True:
            data = await websocket.receive_text()
            message = json.loads(data)

            if message.get("type") == "CODE_UPDATE":
                new_code = message.get("payload")
                await r.set(redis_key_code, new_code)
                
                response_json = json.dumps({
                    "type": "CODE_UPDATE",
                    "payload": new_code
                })
                await manager.broadcast_code(response_json, room_id, websocket)

    except WebSocketDisconnect:
        await manager.disconnect(websocket, room_id, r)
        await manager.broadcast_user_list(room_id, r)
    except Exception as e:
        print(f"WebSocket Error: {e}")
        await manager.disconnect(websocket, room_id, r)