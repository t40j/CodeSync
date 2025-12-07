# CodeSync - Real-time Pair Programming Prototype

A simplified real-time collaborative code editor built with **Python (FastAPI)** and **PostgreSQL**. It features room-based collaboration, WebSocket synchronization, and a mocked AI autocomplete engine.

## 🚀 Features
* **Real-time Collaboration:** Two users can edit the same document simultaneously (WebSocket).
* **Room Management:** Create unique rooms with persistent code storage.
* **Mock AI Autocomplete:** "Smart" code suggestions based on cursor position and keywords.
* **Persistence:** Room state is saved to PostgreSQL, ensuring data isn't lost on server restarts.

---

## 🛠️ Tech Stack

### Backend
* **Framework:** FastAPI (Python 3.11+)
* **Database:** PostgreSQL 18
* **Driver:** `psycopg` (Standard binary driver)
* **Protocol:** WebSockets (for real-time sync) & REST (for room creation/AI)

### Frontend
* **Framework:** Next.js (React)
* **Language:** TypeScript
* **State Management:** Redux Toolkit
* **Styling:** CSS Modules / Tailwind (Optional)

---

## 🏗️ Architecture & Design Choices

1.  **WebSockets for Sync:**
    * We use WebSockets instead of HTTP polling because collaborative editing requires low latency (sub-50ms) to feel natural. Polling would introduce lag and unnecessary server load.

2.  **Sync Strategy (Last-Write-Wins):**
    * For this prototype, I implemented a "Last-Write-Wins" strategy. The server broadcasts the latest full text state to all clients in the room.
    * *Why:* It is significantly easier to implement than Operational Transforms (OT) or CRDTs within a short timeframe, and works sufficiently well for a 2-user concurrency limit.

3.  **Database Persistence:**
    * Room state (code) is stored in PostgreSQL.
    * *Why:* In-memory storage is fast but volatile. By persisting to DB, users can refresh the page or rejoin later and pick up where they left off.
    * *Optimization:* We use an in-memory cache in the `WebSocketManager` for instant broadcasts, and write to the DB asynchronously to avoid blocking the event loop.

4.  **Mocked AI:**
    * The `/autocomplete` endpoint uses static, deterministic rules (e.g., typing `imp` suggests `import os`). This mimics the request/response cycle of a real LLM without the cost or latency.

---

## ⚙️ Setup & Installation

### 1. Database Setup (PostgreSQL)
Ensure you have PostgreSQL installed.
1.  Create a database named `application_db`.
2.  Run the following SQL to create the required table:

```sql
CREATE TABLE IF NOT EXISTS rooms (
  room_id TEXT PRIMARY KEY,
  code TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT now()
);
```
### 2. Backend Setup
**Prerequisites:** Python 3.11+

1.  Navigate to the backend folder:
    ```bash
    cd codesync-backend
    ```

2.  Create and activate a virtual environment:
    * **Windows:**
        ```bash
        python -m venv .venv
        .venv\Scripts\Activate
        ```
    * **Mac/Linux:**
        ```bash
        python3 -m venv .venv
        source .venv/bin/activate
        ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  Configure Environment:
    Create a `.env` file in the `backend/` folder:
    ```ini
    DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/application_db
    WS_MAX_CLIENTS_PER_ROOM=2
    ```
5.  Backend Setup (FastAPI)

    1.  Run the Server:
        ```bash
        uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
        ```

    2.  Verify the endpoints:
        * **API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
        * **WebSocket:** `ws://localhost:8000/ws/{room_id}`

### 3. Frontend Setup (Next.js + TypeScript)
**Prerequisites:** Node.js 18+

1.  Navigate to the frontend folder:
    ```bash
    cd codesync-frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or if using yarn:
    yarn install
    ```

3.  Run the Client:
    ```bash
    npm run dev
    ```

4.  Open your browser to [http://localhost:3000](http://localhost:3000).

## 📂 Project Structure

```text
CODESYNC/
├── codesync-backend/         # FastAPI Server
│   ├── .venv/                # Virtual Environment
│   ├── app/
│   │   ├── routers/          # API Route definitions
│   │   ├── __init__.py
│   │   ├── config.py         # Environment settings
│   │   ├── db.py             # Database connection logic
│   │   ├── main.py           # App entry point
│   │   ├── services.py       # Business logic
│   │   └── ws_manager.py     # WebSocket manager
│   ├── .env
│   └── requirements.txt
│
└── codesync-frontend/        # Next.js Client
    ├── public/               # Static assets
    ├── src/
    │   ├── app/              # Next.js App Router pages
    │   ├── components/       # Reusable UI components
    │   ├── hooks/            # Custom React hooks
    │   └── lib/              # Utility functions
    ├── .env.local
    ├── next.config.ts
    ├── package.json
    ├── postcss.config.mjs
    └── eslint.config.mjs
```

## ⚠️ Limitations

* **Concurrency Conflict:**
  Because we use "Last-Write-Wins" with full text replacement, if two users type at the exact same millisecond, one user's keystroke might overwrite the other's.

* **Scalability:**
  The WebSocketManager stores room state in server memory. This works for one server instance. To scale to multiple servers, we would need a Pub/Sub system (like Redis) to broadcast messages across instances.

* **Security:**
  There is currently no authentication or room password protection. Anyone with a room ID can join.

---

## 🚀 Future Improvements (With more time)

* **Operational Transform (OT) or CRDTs:**
  Replace full-text sync with character-level diffs (CRDTs like Yjs) to handle conflicts gracefully and support more than 2 users.

* **Frontend Polish:**
  Integrate the Monaco Editor (VS Code editor) fully for syntax highlighting and real cursor position sharing.

* **Redis Layer:**
  Add Redis for managing WebSocket presence and scaling horizontal instances.

* **Real AI:**
  Connect the `/autocomplete` endpoint to a real LLM (OpenAI or HuggingFace) for actual code generation.