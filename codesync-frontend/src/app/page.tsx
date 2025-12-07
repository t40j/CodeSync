"use client";

import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [roomIdInput, setRoomIdInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreateRoom() {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/rooms`, { method: "POST" });
      const json = await res.json();
      router.push(`/editor/${json.roomId}`);
    } catch (e) {
      console.error(e);
      alert("Failed to create room");
      setIsLoading(false);
    }
  }

  async function handleJoinRoom() {
    const id = roomIdInput.trim();
    if (!id) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/rooms/${id}`);
      
      if (res.ok) {
        router.push(`/editor/${id}`);
      } else {
        alert("Room not found! Please check the ID.");
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
      alert("Error connecting to server");
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />

      <div className="max-w-md w-full bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-8 rounded-2xl shadow-2xl z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            CodeSync
          </h1>
          <p className="text-zinc-400 text-sm">
            Real-time collaboration powered by FastAPI & WebSockets
          </p>
        </div>

        <button
          onClick={handleCreateRoom}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mb-6"
        >
          {isLoading ? "Loading..." : " Create New Room"}
        </button>

        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-zinc-700"></div>
          <span className="flex-shrink-0 mx-4 text-zinc-500 text-xs uppercase tracking-widest">
            OR JOIN
          </span>
          <div className="flex-grow border-t border-zinc-700"></div>
        </div>

        <div className="space-y-3">
          <input
            value={roomIdInput}
            onChange={(e) => setRoomIdInput(e.target.value)}
            placeholder="Enter Room ID..."
            className="w-full bg-zinc-950 border border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-600"
          />
          <button
            onClick={handleJoinRoom}
            disabled={!roomIdInput.trim() || isLoading}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Checking..." : "Join Room"}
          </button>
        </div>
      </div>
    </main>
  );
}