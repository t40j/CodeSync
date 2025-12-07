# simple settings loader so we can read values from .env and keep configuration in one place.

from pydantic import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    WS_MAX_CLIENTS_PER_ROOM: int

    class Config:
        env_file = ".env"

settings = Settings()
