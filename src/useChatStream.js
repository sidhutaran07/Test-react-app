import { useCallback, useRef, useState } from "react";

export function useChatStream({ endpoint = "/.netlify/functions/chat-grok-stream" } = {}) {
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef(null);

  const send = useCallback(async ({ messages, onToken, onDone, model, temperature }) => {
    setIsStreaming(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, model, temperature }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const err = await res.text().catch(() => "Request failed");
        throw new Error(err);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let partial = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        partial += decoder.decode(value, { stream: true });

        const events = partial.split("\n\n");
        partial = events.pop() || "";

        for (const evt of events) {
          const line = evt.trim();
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();

          if (data === "[DONE]") { onDone?.(); setIsStreaming(false); return; }
          if (data.startsWith("__error__:")) throw new Error(data.slice("__error__:".length));
          onToken?.(data);
        }
      }

      onDone?.();
    } catch (e) {
      setIsStreaming(false);
      throw e;
    } finally {
      setIsStreaming(false);
    }
  }, [endpoint]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  return { send, cancel, isStreaming };
}
