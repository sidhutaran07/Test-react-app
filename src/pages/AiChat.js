import { useMemo, useState } from "react";
import Banner from "./components/Banner";
import ChatComposer from "./components/ChatComposer";
import { useChatStream } from "./useChatStream";
import { Card, CardContent } from "./components/ui/card";
import { Separator } from "./components/ui/separator";

export default function AiChat () {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Ask me anything ✨" },
  ]);
  const [streamBuffer, setStreamBuffer] = useState("");
  const { send, cancel, isStreaming } = useChatStream();

  const convo = useMemo(() => (
    streamBuffer ? [...messages, { role: "assistant", content: streamBuffer }] : messages
  ), [messages, streamBuffer]);

  async function handleSend(userText) {
    const base = [...messages, { role: "user", content: userText }];
    setMessages(base);
    setStreamBuffer("");

    await send({
      messages: base,
      onToken: (t) => setStreamBuffer((s) => s + t),
      onDone: () => {
        setMessages((prev) => [...prev, { role: "assistant", content: streamBuffer || "" }]);
        setStreamBuffer("");
      },
    });
  }

  return (
    <div className="min-h-dvh bg-neutral-950 text-white antialiased">
      <div className="mx-auto max-w-3xl p-4 md:p-6 space-y-6">
        <Banner />

        <Card>
          <CardContent>
            <div className="space-y-3">
              {convo.map((m, i) => (
                <div
                  key={i}
                  className={`w-fit max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "ml-auto bg-sky-500/15 ring-1 ring-sky-400/30"
                      : "bg-white/5 ring-1 ring-white/10"
                  }`}
                >
                  {m.content}
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="flex items-center gap-2 text-xs text-white/50">
              {isStreaming ? <span className="animate-pulse">Streaming…</span> : <span>Idle</span>}
              {isStreaming && (
                <button onClick={cancel} className="ml-auto underline decoration-white/30 hover:decoration-white/60">
                  Stop
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        <ChatComposer onSend={handleSend} disabled={isStreaming} />
      </div>
    </div>
  );
}
