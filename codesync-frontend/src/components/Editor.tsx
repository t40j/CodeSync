"use client";

import { useEffect, useRef, useState } from "react";
import { API_BASE, WS_HOST } from "@/lib/api";
import useEditorWS from "@/hooks/useEditorWS";
import useAutocomplete from "@/hooks/useAutocomplete";
import StatusIndicator from "@/components/StatusIndicator";
import CodeEditor from "@/components/CodeEditor";
import SuggestionBox from "@/components/SuggestionBox";

type Props = {
  roomId: string;
};

export default function Editor({ roomId }: Props) {
  const [code, setCode] = useState("");
  const [suggestion, setSuggestion] = useState("");

  // remoteUpdate prevents echoing local set to WS
  const remoteUpdate = useRef(false);

  // debounces
  const wsDebounce = useRef<NodeJS.Timeout | null>(null);
  const acDebounce = useRef<NodeJS.Timeout | null>(null);

  // websocket hook
  const { status, send, subscribe } = useEditorWS(roomId, `${WS_HOST}/ws`);

  // autocomplete hook
  const { runAutocomplete } = useAutocomplete(`${API_BASE}/autocomplete`);

  // subscribe to incoming websocket messages
  useEffect(() => {
    const unsubs = subscribe((msg) => {
      if (msg.type === "init" || msg.type === "code_update") {
        remoteUpdate.current = true;
        setCode(msg.code);
        // short delay then allow local typing to trigger WS again
        setTimeout(() => (remoteUpdate.current = false), 30);
      }
    });

    return () => {
      unsubs();
    };
  }, [subscribe]);

  // Debounced WS send
  function sendWS(updated: string) {
    if (wsDebounce.current) clearTimeout(wsDebounce.current);

    wsDebounce.current = setTimeout(() => {
      send({ type: "code_update", code: updated });
    }, 120);
  }

  // handle change from textarea
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newVal = e.target.value;
    setCode(newVal);

    if (!remoteUpdate.current) {
      sendWS(newVal);
    }

    // autocomplete debounce
    if (acDebounce.current) clearTimeout(acDebounce.current);
    const cursorPos = e.target.selectionStart;

    acDebounce.current = setTimeout(async () => {
      const suggestionText = await runAutocomplete(newVal, cursorPos);
      setSuggestion(suggestionText || "");
    }, 600);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Tab" && suggestion.trim()) {
      e.preventDefault();
      const ta = e.currentTarget;
      const cursor = ta.selectionStart;
      const before = code.slice(0, cursor);
      const after = code.slice(cursor);

      const newCode = before + suggestion + after;
      setCode(newCode);

      // Move cursor after inserted suggestion
      setTimeout(() => {
        ta.selectionStart = ta.selectionEnd = cursor + suggestion.length;
      }, 0);

      // send immediately
      sendWS(newCode);
      setSuggestion("");
    }
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Status Bar (Floating) */}
      <div className="absolute top-4 right-6 z-10">
        <StatusIndicator status={status} />
      </div>

      <div className="flex-1 flex flex-col p-4 md:p-6 max-w-7xl mx-auto w-full">
        <div className="relative flex-1 rounded-xl overflow-hidden border border-zinc-800 bg-[#1e1e1e] shadow-2xl">
          <CodeEditor
            value={code}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="# Start typing your Python code here..."
          />

          {/* Suggestion overlay at bottom of editor */}
          {suggestion && (
            <div className="absolute bottom-4 left-4 right-4 z-20">
              <SuggestionBox suggestion={suggestion} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
