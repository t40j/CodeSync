from typing import Dict, List
from fastapi import WebSocket
import asyncio

from .config import settings
from . import services


class RoomManager:
    """
    Stores connected clients for each room.
    Broadcasts changes so everyone stays in sync.
    """
    def __init__(self):
        self.rooms: Dict[str, List[WebSocket]] = {}
        self.lock = asyncio.Lock()

    async def connect(self, room_id: str, websocket: WebSocket):
        await websocket.accept()

        async with self.lock:
            if room_id not in self.rooms:
                self.rooms[room_id] = []
            
           
            self.rooms[room_id].append(websocket)
            print(f"User added to {room_id}.")
        
        return True

    async def disconnect(self, room_id: str, websocket: WebSocket):
        async with self.lock:
            if room_id in self.rooms and websocket in self.rooms[room_id]:
                self.rooms[room_id].remove(websocket)
                print(f"User left {room_id}.")
                
            if room_id in self.rooms and len(self.rooms[room_id]) == 0:
                del self.rooms[room_id]

    async def broadcast(self, room_id: str, sender: WebSocket, message: str):
        async with self.lock:
            if room_id not in self.rooms:
                return
            targets = [ws for ws in self.rooms[room_id] if ws != sender]

        for ws in targets:
            try:
                await ws.send_text(message)
            except Exception as e:
                pass

room_manager = RoomManager()