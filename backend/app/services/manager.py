import json
from fastapi import WebSocket
from typing import List, Dict
import redis.asyncio as redis

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
        self.socket_user_map: Dict[WebSocket, dict] = {}

    async def connect(self, websocket: WebSocket, room_id: str, user_info: dict, r: redis.Redis):
        await websocket.accept()
        
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
        
        self.active_connections[room_id].append(websocket)
        self.socket_user_map[websocket] = user_info

        await r.sadd(f"room_users:{room_id}", json.dumps(user_info))
        
        print(f"User {user_info['name']} connected to Room {room_id}")

    async def disconnect(self, websocket: WebSocket, room_id: str, r: redis.Redis):
        if room_id in self.active_connections:
            if websocket in self.active_connections[room_id]:
                self.active_connections[room_id].remove(websocket)

        if websocket in self.socket_user_map:
            user_info = self.socket_user_map[websocket]
            await r.srem(f"room_users:{room_id}", json.dumps(user_info))
            del self.socket_user_map[websocket]

    async def broadcast_user_list(self, room_id: str, r: redis.Redis):
        try:
            users_bytes = await r.smembers(f"room_users:{room_id}")

            users_list = []
            for u in users_bytes:
                if isinstance(u, bytes):
                    u = u.decode("utf-8") 
                users_list.append(json.loads(u))

            message = json.dumps({
                "type": "USER_LIST_UPDATE",
                "payload": users_list
            })

            if room_id in self.active_connections:
                for connection in self.active_connections[room_id]:
                    await connection.send_text(message)
                    
        except Exception as e:
            print(f"Error broadcasting user list: {e}")

    async def broadcast_code(self, message: str, room_id: str, sender: WebSocket):
        if room_id in self.active_connections:
            for connection in self.active_connections[room_id]:
                if connection != sender:
                    await connection.send_text(message)

manager = ConnectionManager()