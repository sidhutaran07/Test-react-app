// ChatComposer.jsx
import { useEffect, useRef, useState } from "react";

export default function ChatComposer({ onSend }) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const taRef = useRef(null);

  // autosize textarea
  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 260) + "px";
  }, [value]);

  async function handleSubmit() {
    if (!value.trim() || loading) return;
    setLoading(true);
    try {
      await onSend?.(value);
      setValue("");
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="relative rounded-xl p-[1.5px]">
      {/* animated border wrapper */}
      <div className="pointer-events-none absolute inset-0 rounded-xl [mask:linear-gradient(#000,transparent_40%)]">
        <div className="absolute inset-[-60%] animate-spin-slower rounded-full bg-[conic-gradient(at_50%_50%,#22d3ee_0deg,#60a5fa_90deg,#a78bfa_180deg,#f472b6_270deg,#22d3ee_360deg)] opacity-70" />
      </div>

      {/* composer body */}
      <div className="relative rounded-xl bg-neutral-900/70 backdrop-blur ring-1 ring-white/10">
        <div className="flex items-end gap-2 p-3">
          <textarea
            ref={taRef}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Send a message… (Enter to send, Shift+Enter = newline)"
            className="min-h-[44px] max-h-[260px] w-full resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-white/40"
          />

          <button
            onClick={handleSubmit}
            disabled={loading || !value.trim()}
            className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-white ring-1 ring-white/15 transition hover:bg-white/10 disabled:opacity-40"
            aria-label="Send"
          >
            {loading ? "…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
