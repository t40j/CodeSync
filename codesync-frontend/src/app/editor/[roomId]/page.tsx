"use client";

import { use } from "react";
import Editor from "@/components/Editor";

export default function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);

  return (
    <main className="h-screen flex flex-col bg-[#09090b] text-white overflow-hidden">
      {/* Header Bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-4 text-sm font-mono text-zinc-400">
            room: <span className="text-zinc-200">{roomId}</span>
          </span>
        </div>
        <div className="text-xs text-zinc-500 font-medium tracking-wide">
          CODESYNC EDITOR
        </div>
      </header>

      {/* Editor Container */}
      <div className="flex-1 relative">
        <Editor roomId={roomId} />
      </div>
    </main>
  );
}