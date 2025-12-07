"use client";

type Props = {
  suggestion: string;
};

export default function SuggestionBox({ suggestion }: Props) {
  return (
    <div className="bg-blue-950/90 border border-blue-800 text-blue-100 p-3 rounded-lg shadow-lg backdrop-blur-md animate-in slide-in-from-bottom-2 fade-in duration-200">
      <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
        <span>💡 AI Suggestion</span>
        <span className="flex-1"></span>
        <span className="bg-blue-900/50 border border-blue-700/50 px-1.5 py-0.5 rounded text-[10px]">
          Press TAB
        </span>
      </div>
      <pre className="font-mono text-sm whitespace-pre-wrap opacity-90 pl-1 border-l-2 border-blue-500/50">
        {suggestion}
      </pre>
    </div>
  );
}