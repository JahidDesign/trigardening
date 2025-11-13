// app/api/ai/chat/route.ts
import { NextRequest } from "next/server";

// Note: use Next.js route handlers to return streaming Response
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic validation
    if (!body?.messages || !Array.isArray(body.messages)) {
      return new Response(JSON.stringify({ error: "Invalid request: messages required" }), { status: 400 });
    }

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_KEY) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY env" }), { status: 500 });
    }

    // Optional inputs with sensible defaults
    const model = body.model || "gpt-3.5-turbo";
    const temperature = typeof body.temperature === "number" ? body.temperature : 0.2;
    const stream = body.stream !== undefined ? Boolean(body.stream) : true;

    // Prevent huge payloads — trim message history if too large
    const MAX_MESSAGES = 20;
    let messages = body.messages.slice(-MAX_MESSAGES);

    // If client sent images as data-URLs, we add a short note for the model (do NOT include huge base64 blobs)
    messages = messages.map((m: any) => {
      if (m.image && typeof m.image === "string" && m.image.startsWith("data:")) {
        // Keep only a short placeholder for the model prompt
        return {
          ...m,
          content: `${m.content ?? ""}\n\n[Image attached: base64 image omitted in prompt; user attached an image — describe likely visible issues and recommended steps.]`,
        };
      }
      return m;
    });

    // Ensure there is a system message
    const hasSystem = messages.some((m: any) => m.role === "system");
    if (!hasSystem) {
      messages.unshift({
        role: "system",
        content:
          "You are TriGardening assistant. Provide helpful, concise guidance about houseplants, pests, watering, fertilizers and light. If user uploads an image, describe likely issues (look for spots, pests, mold) and give actionable next steps. Reply in short paragraphs. Use polite, clear language.",
      });
    }

    // Build request to OpenAI Chat Completions (streamed)
    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: 600,
        stream, // ask OpenAI to stream tokens
      }),
    });

    if (!openaiResp.ok) {
      const text = await openaiResp.text();
      return new Response(JSON.stringify({ error: text }), { status: 502 });
    }

    // If not streaming, just forward the JSON body (convenience)
    if (!stream) {
      const json = await openaiResp.json();
      const assistantText = json.choices?.[0]?.message?.content ?? json.choices?.[0]?.text ?? "";
      return new Response(JSON.stringify({ answer: assistantText, raw: json }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // STREAMING: openaiResp.body is a ReadableStream that emits data: lines (SSE-like)
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Create a new ReadableStream to proxy token events to client
    const streamToClient = new ReadableStream({
      async start(controller) {
        try {
          const reader = openaiResp.body!.getReader();
          let done = false;

          while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            if (value) {
              const chunk = decoder.decode(value);
              // OpenAI streaming returns "data: {...}\n\n" messages, plus "data: [DONE]"
              // We'll forward chunks raw to client so client can parse events
              controller.enqueue(encoder.encode(chunk));
            }
          }
        } catch (err) {
          // forward error text
          controller.enqueue(encoder.encode(JSON.stringify({ error: "Stream error", detail: String(err) })));
        } finally {
          controller.close();
        }
      },
    });

    // Return streaming response with content-type text/event-stream-like so client can parse
    return new Response(streamToClient, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message ?? "Unknown error" }), { status: 500 });
  }
}
