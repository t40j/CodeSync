"use client";

import { useEffect, useRef, useCallback, useState } from "react";

type WSMessage = { type: string; [k: string]: any };
type Subscriber = (msg: WSMessage) => void;

export default function useEditorWS(roomId: string, wsHostBase: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const subscribersRef = useRef<Subscriber[]>([]);
  
  const [status, setStatus] = useState<"connected" | "disconnected">("disconnected");

  const subscribe = useCallback((cb: Subscriber) => {
    subscribersRef.current.push(cb);
    return () => {
      subscribersRef.current = subscribersRef.current.filter((s) => s !== cb);
    };
  }, []);

  const send = useCallback((payload: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    console.log(`🔌 Connecting to: ${wsHostBase}/${roomId}`);
    
    const ws = new WebSocket(`${wsHostBase}/${roomId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!isMounted) {
        ws.close();
        return;
      }
      console.log(" WebSocket Connected");
      setStatus("connected");
    };

    ws.onclose = (event) => {
      console.log("WebSocket Disconnected. Code:", event.code);
      
      if (isMounted) {
        setStatus("disconnected");
        if (event.code === 4000) {
          alert("Error: This room does not exist.");
        }
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket Error (Check Network Tab):", err);
      if (isMounted) setStatus("disconnected");
    };

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        subscribersRef.current.forEach((s) => s(msg));
      } catch (err) {
        console.error("Failed to parse WS message", err);
      }
    };

    return () => {
      isMounted = false;
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      ws.onopen = null;
      ws.onclose = null;
      ws.onmessage = null;
    };
  }, [roomId, wsHostBase]);

  return { status, send, subscribe };
}