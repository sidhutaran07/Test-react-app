// netlify/functions/chat-grok-stream.js
export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const apiKey = process.env.GROK_API_KEY;          // set in Netlify
  const apiUrl = process.env.GROK_API_URL || "";    // e.g. xAI chat/completions endpoint
  if (!apiKey || !apiUrl) {
    return new Response("Server not configured", { status: 500 });
  }

  const { messages, model = "grok-2", temperature = 0.7 } = await req.json();

  // Kick off upstream request with streaming enabled
  const upstream = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      stream: true, // IMPORTANT
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "");
    return new Response(text || "Upstream error", { status: upstream.status || 500 });
  }

  // We’ll parse upstream SSE and forward *just text deltas* as SSE.
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    start(controller) {
      // SSE headers must be set on the *outer* response (below)
      // Read upstream chunks and forward `data:` lines
      const reader = upstream.body.getReader();
      let buffer = "";

      function enqueueSSE(data) {
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      }

      const pump = () =>
        reader.read().then(({ value, done }) => {
          if (done) {
            enqueueSSE("[DONE]");
            controller.close();
            return;
          }
          buffer += decoder.decode(value, { stream: true });

          // Split into lines; handle multiple events per chunk
          const parts = buffer.split(/\r?\n\r?\n/);
          buffer = parts.pop() || "";

          for (const part of parts) {
            // Many providers send lines like: "data: {json}"
            for (const line of part.split(/\r?\n/)) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;

              const payload = trimmed.slice(5).trim();
              if (payload === "[DONE]") {
                enqueueSSE("[DONE]");
                controller.close();
                return;
              }

              // Try parse JSON; fall back to raw text
              try {
                const json = JSON.parse(payload);
                // Common shapes:
                // - OpenAI-like: json.choices[0].delta.content
                // - Generic: json.text / json.content / json.msg
                const delta =
                  json?.choices?.[0]?.delta?.content ??
                  json?.choices?.[0]?.message?.content ??
                  json?.text ??
                  json?.content ??
                  json?.delta ??
                  "";
                if (delta) enqueueSSE(delta);
              } catch {
                // If it wasn’t JSON, stream raw
                if (payload) enqueueSSE(payload);
              }
            }
          }
          return pump();
        });

      pump().catch((err) => {
        enqueueSSE(`__error__:${err?.message || "stream error"}`);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      // Netlify specific: ensure no compression interferes with SSE
      "Transfer-Encoding": "chunked",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
