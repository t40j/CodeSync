from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import rooms, autocomplete, ws

app = FastAPI(title="CodeSync API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False, 
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rooms.router)
app.include_router(autocomplete.router)
app.include_router(ws.router)