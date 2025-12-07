import asyncio
import random
import uuid
from typing import Optional
from . import db

# --- Custom ID Logic ---
ADJECTIVES = [
    "cool", "super", "silent", "cosmic", "neon", "cyber", "retro", "brave", 
    "swift", "wild", "atomic", "pixel", "dark", "shiny", "happy", "crimson"
]
NOUNS = [
    "panda", "ninja", "tiger", "rocket", "wizard", "phoenix", "dragon", "wolf",
    "eagle", "coder", "glitch", "vortex", "star", "falcon", "cobra", "proton"
]

def generate_custom_id() -> str:
    adj = random.choice(ADJECTIVES)
    noun = random.choice(NOUNS)
    num = random.randint(10, 99)
    return f"{adj}-{noun}-{num}"

# -----------------------

async def create_room_in_db() -> str:
    """
    Generate a unique 'cool' room ID, persist it in the DB, and return it.
    Retries up to 5 times if there's a collision.
    """
    for _ in range(5):
        room_id = generate_custom_id()
        
        # Check if ID exists in DB before creating (prevent primary key collision)
        existing = await asyncio.to_thread(db.get_room_code, room_id)
        if existing is None:
            # ID is free! Create the row.
            await asyncio.to_thread(db.create_room_row, room_id)
            return room_id

    # Fallback to UUID if 5 random attempts fail (extremely rare)
    fallback_id = str(uuid.uuid4())[:8]
    await asyncio.to_thread(db.create_room_row, fallback_id)
    return fallback_id

async def get_room_code(room_id: str) -> Optional[str]:
    """
    Return the saved code for a room.
    Returns None if the room does not exist in DB.
    Returns "" if the room exists but code is empty.
    """
    result = await asyncio.to_thread(db.get_room_code, room_id) 
    return result

async def set_room_code(room_id: str, code: str) -> None:
    """
    Persist the latest code for a room.
    Called from the websocket manager (fire-and-forget allowed).
    """
    await asyncio.to_thread(db.update_room_code, room_id, code)
