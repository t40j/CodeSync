"use client";

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
};

export default function CodeEditor({ value, onChange, onKeyDown, placeholder }: Props) {
  return (
    <textarea
      className="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] p-4 font-mono text-sm leading-6 resize-none focus:outline-none placeholder:text-zinc-600"
      spellCheck={false}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
    />
  );
}
