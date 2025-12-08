# CodeSync - Real-time Pair Programming Prototype

A simplified real-time collaborative code editor built with **Next.js**, **Python (FastAPI)**, and **PostgreSQL**. It features room-based collaboration, WebSocket synchronization, and a mocked AI autocomplete engine.

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
* **State Management:** Zustand
* **Styling:** Tailwind CSS

---

## 🏗️ Architecture & Design Choices

1.  **WebSockets for Sync:**
    * We use WebSockets instead of HTTP polling because collaborative editing requires low latency (sub-50ms) to feel natural. Polling would introduce lag and unnecessary server load.

2.  **Sync Strategy (Last-Write-Wins):**
    * The application uses a "Last-Write-Wins" model, where the server broadcasts the latest state of the code to all connected clients.
    * *Why:* While production editors use complex algorithms like Operational Transforms, I prioritized a simpler implementation for this prototype. It handles the goal of 2-user collaboration effectively without the massive overhead of building a CRDT system from scratch.

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

2.  **Create and activate a virtual environment:**
    * *Why?* This isolates the project's dependencies from your global Python installation, preventing version conflicts and keeping your system clean.
    
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
    Create a `.env` file in the `codesync-backend/` folder, or copy the `.env.example` file to create your local config:
    ```ini
    DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/application_db
    ```

5.  Backend Setup (FastAPI)

    1.  Run the Server:
        ```bash
        uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
        ```
        > **Command Breakdown:**
        > * `uvicorn`: The high-performance server that runs your Python/FastAPI code.
        > * `app.main:app`: Tells Uvicorn to look in `app/main.py` for the `app` object.
        > * `--reload`: Automatically restarts the server when you save code changes (Development only).
        > * `--host 0.0.0.0`: Makes the server accessible to other devices on your network.


    2.  Verify the endpoints:
        * **API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
        * **WebSocket:** `ws://localhost:8000/ws/{room_id}`
    
            > **How to test:** > Go to [http://localhost:8000/docs](http://localhost:8000/docs), open the Console (**F12**), and run:
            > ```javascript
            > new WebSocket("ws://localhost:8000/ws/test").onopen = () => console.log("Connected!");
            > ```

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

    <img src="codesync-frontend\public\frontendInterfaceScreenshot.jpg" alt="Frontend Interface Screenshot" width="700" />

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
    │   ├ store/              # Zustand Store
    │   └── lib/              # Utility functions
    ├── .env.local
    ├── next.config.ts
    ├── package.json
    ├── postcss.config.mjs
    └── eslint.config.mjs
```

## ⚠️ Current Limitations

* **Concurrency Conflict:**
  Because we use "Last-Write-Wins" with full text replacement, if two users type at the exact same millisecond, one user's keystroke might overwrite the other's.

* **Server Scaling:**
  Room data is currently stored in memory on a single server instance. To run this on a larger scale (like AWS with multiple nodes), we'd need to add a Pub/Sub layer like Redis.

* **Security:**
  There is currently no authentication or room password protection. Anyone with a room ID can join.

---

## 🚀 Future Roadmap

* **Smart Conflict Resolution:**
  The current system uses a simple "overwrite" method. A key improvement would be to implement logic that intelligently merges changes when two users type at the same time, ensuring no work is lost during simultaneous editing.

* **Professional Editor Interface:**
  The plan is to upgrade the simple text area to a full-featured code editor. This would introduce syntax highlighting (coloring), line numbers, and the ability to see exactly where other users are clicking and typing.

* **High-Volume Scalability:**
  While the project works well for small groups, future updates would focus on optimizing the server architecture to handle hundreds of active rooms and users simultaneously without slowing down.

* **Dynamic AI Integration:**
  Currently, the autocomplete provides static, pre-set suggestions. Integrating a live AI service would allow the application to generate, debug, and explain code dynamically based on what the user is actually typing.