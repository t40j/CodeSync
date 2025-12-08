"use client";

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  fontSize: number;
};

export default function CodeEditor({ value, onChange, onKeyDown, placeholder, fontSize }: Props) {
  return (
    <textarea
      style={{ fontSize: `${fontSize}px` }} 
      className="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] p-4 font-mono leading-6 resize-none focus:outline-none placeholder:text-zinc-600 transition-all"
      spellCheck={false}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
    />
  );
}
