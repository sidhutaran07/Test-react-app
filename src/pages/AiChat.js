// src/pages/AiChat.js
import { useEffect, useMemo, useRef, useState } from "react";
import Banner from "../components/Banner";
import ChatComposer from "../components/ChatComposer";
import { useChatStream } from "../useChatStream";

export default function AiChat() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Ask me anything ✨" },
  ]);
  const [streamBuffer, setStreamBuffer] = useState("");
  const { send, cancel, isStreaming } = useChatStream();

  // auto-scroll to bottom on new content
  const scrollRef = useRef(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, streamBuffer]);

  const convo = useMemo(
    () =>
      streamBuffer
        ? [...messages, { role: "assistant", content: streamBuffer }]
        : messages,
    [messages, streamBuffer]
  );

  async function handleSend(userText) {
    // append user message
    const base = [...messages, { role: "user", content: userText }];
    setMessages(base);

    // stream-safe accumulator to avoid "vanishing" response
    let acc = "";
    setStreamBuffer("");

    await send({
      messages: base,
      onToken: (t) => {
        acc += t;
        setStreamBuffer(acc);
      },
      onDone: () => {
        setMessages((prev) => [...prev, { role: "assistant", content: acc }]);
        setStreamBuffer("");
      },
    });
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-neutral-950 via-black to-neutral-950 text-white antialiased">
      <div className="mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-10 space-y-6">

        {/* Top banner / header */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6 backdrop-blur-sm">
          <Banner />
          <p className="mt-3 text-xs md:text-sm text-white/70">
            Press <kbd className="rounded bg-white/10 px-1">Enter</kbd> to send •{" "}
            <kbd className="rounded bg-white/10 px-1">Shift</kbd>+
            <kbd className="rounded bg-white/10 px-1">Enter</kbd> for newline
          </p>
        </section>

        {/* Chat card */}
        <section className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden shadow-lg">
          {/* Scrollable convo area */}
          <div
            ref={scrollRef}
            className="max-h-[65vh] overflow-y-auto p-4 md:p-6 space-y-3
                       [scrollbar-color:_theme(colors.white/20)_transparent]"
          >
            {convo.map((m, i) => {
              const isUser = m.role === "user";
              return (
                <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={[
                      "max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ring-1 text-sm md:text-base leading-relaxed",
                      // WRAPPING FIX:
                      "whitespace-pre-wrap break-words",
                      isUser
                        ? "bg-gradient-to-r from-sky-500/20 to-sky-600/20 ring-sky-400/25 text-sky-100"
                        : "bg-gradient-to-r from-white/10 to-white/5 ring-white/15 text-white/90",
                    ].join(" ")}
                  >
                    {m.content}
                  </div>
                </div>
              );
            })}
            {!isStreaming && convo.length === 0 && (
              <div className="text-center text-white/40 text-sm">No messages yet</div>
            )}
          </div>

          {/* Status row */}
          <div className="flex items-center gap-3 px-4 md:px-6 py-2 text-xs text-white/60 border-t border-white/10">
            {isStreaming ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Streaming…
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white/25" />
                Idle
              </span>
            )}

            {isStreaming && (
              <button
                onClick={cancel}
                className="ml-auto rounded-md border border-white/15 bg-white/5 px-2.5 py-1 hover:bg-white/10"
              >
                Stop
              </button>
            )}
          </div>
        </section>

        {/* Composer (sticky on mobile) */}
        <section className="sticky bottom-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-3">
            <ChatComposer onSend={handleSend} disabled={isStreaming} />
          </div>
        </section>
      </div>
    </div>
  );
}
