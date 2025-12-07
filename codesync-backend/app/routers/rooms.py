from fastapi import APIRouter, HTTPException
from .. import services

router = APIRouter(prefix="/rooms", tags=["rooms"])

@router.post("")
async def create_room():
    """
    Create a new room and return its id.
    """
    room_id = await services.create_room_in_db()
    return {"roomId": room_id}

@router.get("/{room_id}")
async def get_room(room_id: str):
    """
    Return the current saved code for the given room.
    """
    code = await services.get_room_code(room_id)
    if code is None:
        raise HTTPException(status_code=404, detail="Room not found")

    return {"roomId": room_id, "code": code}