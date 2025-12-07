"use client";

type Props = {
  status: "connected" | "disconnected" | string;
};

export default function StatusIndicator({ status }: Props) {
  const isConnected = status === "connected";

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md shadow-sm transition-colors duration-300 ${
      isConnected 
        ? "bg-green-500/10 border-green-500/20 text-green-400" 
        : "bg-red-500/10 border-red-500/20 text-red-400"
    }`}>
      <span className="relative flex h-2 w-2">
        {isConnected && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? "bg-green-500" : "bg-red-500"}`}></span>
      </span>
      <span className="text-xs font-semibold uppercase tracking-wider">
        {status}
      </span>
    </div>
  );
}