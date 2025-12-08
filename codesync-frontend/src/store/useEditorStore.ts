import { create } from 'zustand';

interface EditorState {
  // The core state
  code: string;
  setCode: (code: string) => void;
  
  // UI State (Added to demonstrate Zustand capabilities)
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  code: "",
  setCode: (code) => set({ code }),
  
  fontSize: 14, // default size
  increaseFontSize: () => set((state) => ({ fontSize: Math.min(state.fontSize + 2, 24) })),
  decreaseFontSize: () => set((state) => ({ fontSize: Math.max(state.fontSize - 2, 10) })),
}));