"use client";

export default function useAutocomplete(endpoint: string) {
  async function runAutocomplete(currentCode: string, cursor: number) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: currentCode,
          cursorPosition: cursor,
          language: "python",
        }),
      });

      if (!res.ok) return "";

      const json = await res.json();
      return json.suggestion || "";
    } catch (err) {
      console.error("Autocomplete error", err);
      return "";
    }
  }

  return { runAutocomplete };
}
