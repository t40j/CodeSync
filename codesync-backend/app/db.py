import psycopg
from typing import Optional
from .config import settings

DSN = settings.DATABASE_URL

def _get_conn():
    return psycopg.connect(DSN, autocommit=True)

def create_room_row(room_id: str):
    sql = """INSERT INTO rooms (room_id, code)
             VALUES (%s, %s)
             ON CONFLICT (room_id) DO NOTHING;"""

    with _get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (room_id, ""))

def get_room_code(room_id: str) -> Optional[str]:
    sql = "SELECT code FROM rooms WHERE room_id = %s;"

    with _get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (room_id,))
            row = cur.fetchone()
            return row[0] if row else None

def update_room_code(room_id: str, code: str):
    sql = "UPDATE rooms SET code = %s WHERE room_id = %s;"

    with _get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (code, room_id))
