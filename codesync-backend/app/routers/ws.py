from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json
import asyncio
from ..ws_manager import room_manager
from .. import services

router = APIRouter(tags=["ws"])

@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    ok = await room_manager.connect(room_id, websocket)
    if not ok:
        return

    try:
        current_code = await services.get_room_code(room_id) or ""
        
        await websocket.send_json({
            "type": "init", 
            "code": current_code
        })

        while True:
            text = await websocket.receive_text()
            
            try:
                msg = json.loads(text)
                
                if msg.get("type") == "code_update":
                    new_code = msg.get("code", "")
                    await room_manager.broadcast(room_id, sender=websocket, message=text)
                    asyncio.create_task(services.set_room_code(room_id, new_code))
                    
            except Exception as e:
                print(f"Error processing message: {e}")
                continue

    except WebSocketDisconnect:
        await room_manager.disconnect(room_id, websocket)