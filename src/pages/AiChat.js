import { useEffect, useMemo, useRef, useState } from "react";
import Banner from "../components/Banner";
import ChatComposer from "../components/ChatComposer";
import { useChatStream } from "../useChatStream";
import { Card, CardContent } from "../components/ui/Card";
import { Separator } from "../components/ui/Separator";

export default function AiChat() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Ask me anything ✨" },
  ]);
  const [streamBuffer, setStreamBuffer] = useState("");
  const { send, cancel, isStreaming } = useChatStream();

  // auto-scroll to bottom on new content
  const scrollRef = useRef(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streamBuffer]);

  const convo = useMemo(
    () =>
      streamBuffer
        ? [...messages, { role: "assistant", content: streamBuffer }]
        : messages,
    [messages, streamBuffer]
  );

  async function handleSend(userText) {
    // 1) append user message
    const base = [...messages, { role: "user", content: userText }];
    setMessages(base);

    // 2) stream-safe accumulator (prevents the “vanish” bug)
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
    <div className="min-h-dvh bg-gradient-to-b from-neutral-950 via-neutral-950 to-black text-white antialiased">
      <div className="mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-10 space-y-6">
        {/* Top banner */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 md:p-6">
          <Banner />
          <p className="mt-3 text-sm text-white/70">
            A minimalist, fast chat with live streaming. Press <kbd className="rounded bg-white/10 px-1">Enter</kbd> to
            send • <kbd className="rounded bg-white/10 px-1">Shift</kbd>+<kbd className="rounded bg-white/10 px-1">Enter</kbd> for newline
          </p>
        </div>

        {/* Chat card */}
        <Card className="bg-white/5 border-white/10">
          {/* Scrollable conversation area */}
          <CardContent className="p-0">
            <div
              ref={scrollRef}
              className="max-h-[60vh] overflow-y-auto p-4 md:p-6 space-y-3 [scrollbar-color:_theme(colors.white/20)_transparent] rounded-t-2xl"
            >
              {convo.map((m, i) => {
                const isUser = m.role === "user";
                return (
                  <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={[
                        "max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm ring-1",
                        isUser
                          ? "bg-sky-500/15 ring-sky-400/25 text-sky-100"
                          : "bg-white/5 ring-white/10 text-white/90",
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

            <Separator className="my-0 border-white/10" />

            {/* Status + controls */}
            <div className="flex items-center gap-3 px-4 md:px-6 py-2 text-xs text-white/60">
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
          </CardContent>
        </Card>

        {/* Composer */}
        <div className="sticky bottom-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur supports-[backdrop-filter]:bg-white/5 p-3">
            <ChatComposer onSend={handleSend} disabled={isStreaming} />
          </div>
        </div>
      </div>
    </div>
  );
                    }
