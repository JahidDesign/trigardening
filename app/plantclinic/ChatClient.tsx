"use client";

import React, { useEffect, useRef, useState } from "react";

type Role = "user" | "assistant" | "system";
type Message = {
  id: string;
  role: Role;
  text?: string;
  image?: string; // data URL preview
  createdAt: string;
};

const STORAGE_KEY = "tg_ai_chat_history_v1";

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function ChatClient() {
  const [history, setHistory] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState("");
  const messagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setHistory(JSON.parse(raw));
      } catch {}
    } else {
      const seed: Message[] = [
        {
          id: uid(),
          role: "assistant",
          text: "Hi! I'm TriGardening assistant. Send a photo of your plant or ask plant care questions.",
          createdAt: new Date().toISOString(),
        },
      ];
      setHistory(seed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    scrollToBottom();
  }, [history]);

  function scrollToBottom() {
    setTimeout(() => {
      messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
    }, 60);
  }

  function onAttachImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(f);
    e.currentTarget.value = "";
  }

  // STREAMING-aware send
  async function handleSend(text?: string) {
    if (loading) return;
    const messageText = (text ?? input).trim();
    if (!messageText && !selectedImage) return;

    const userMsg: Message = {
      id: uid(),
      role: "user",
      text: messageText || undefined,
      image: selectedImage || undefined,
      createdAt: new Date().toISOString(),
    };

    // Add user message to history
    setHistory((h) => [...h, userMsg]);
    setInput("");
    setSelectedImage(null);

    // Create a provisional assistant message that we'll update while streaming
    const assistantId = uid();
    const assistantMsg: Message = {
      id: assistantId,
      role: "assistant",
      text: "",
      createdAt: new Date().toISOString(),
    };
    setHistory((h) => [...h, assistantMsg]);

    setLoading(true);

    try {
      // Build payload: include recent history + userMsg. Avoid sending huge base64 blobs to server.
      const messagesPayload = [...history, userMsg].slice(-20).map((m) => ({
        role: m.role,
        content: m.image ? `${m.text ?? ""}\n\n[Image attached — omitted from prompt]` : m.text ?? "",
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: messagesPayload, stream: true }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "AI service failed");
      }

      // Read the streaming response
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let done = false;

      // As tokens arrive we'll update the assistant message in state
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = !!doneReading;
        if (value) {
          buffer += decoder.decode(value, { stream: true });

          // OpenAI streams SSE-like "data: {...}\n\n" messages.
          // Extract complete lines from buffer.
          const parts = buffer.split("\n");
          // Keep the last partial line in buffer
          buffer = parts.pop() ?? "";

          for (const rawLine of parts) {
            const line = rawLine.trim();
            if (!line) continue;

            // lines may be like "data: { ... }" or "[DONE]" etc.
            const payloadStr = line.startsWith("data:") ? line.replace(/^data:\s*/, "") : line;

            if (payloadStr === "[DONE]") {
              // finished
              done = true;
              break;
            }

            try {
              const parsed = JSON.parse(payloadStr);
              // Chat completions stream uses parsed.choices[0].delta.content for tokens
              const delta = parsed.choices?.[0]?.delta?.content;
              const text = parsed.choices?.[0]?.text; // fallback for older endpoints
              const token = delta ?? text ?? "";

              if (token) {
                // append token to assistant message currently in history
                setHistory((prev) =>
                  prev.map((m) => (m.id === assistantId ? { ...m, text: (m.text ?? "") + token } : m))
                );
              }
            } catch (e) {
              // If the payload isn't JSON, append raw text as fallback
              setHistory((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, text: (m.text ?? "") + payloadStr } : m))
              );
            }
          }
        }
      }

      // Final flush: if there is leftover in buffer that wasn't parsed as lines, attempt to extract tokens
      if (buffer.trim()) {
        // try to parse leftover chunk(s)
        const leftoverLines = buffer.split("\n").map((l) => l.trim()).filter(Boolean);
        for (const l of leftoverLines) {
          const payloadStr = l.startsWith("data:") ? l.replace(/^data:\s*/, "") : l;
          if (payloadStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(payloadStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            const text = parsed.choices?.[0]?.text ?? "";
            const token = delta ?? text ?? "";
            if (token) {
              setHistory((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, text: (m.text ?? "") + token } : m))
              );
            }
          } catch {
            setHistory((prev) =>
              prev.map((m) => (m.id === assistantId ? { ...m, text: (m.text ?? "") + payloadStr } : m))
            );
          }
        }
      }

      // If the assistant message ended up empty for some reason, put a fallback
      setHistory((prev) =>
        prev.map((m) => (m.id === assistantId && !m.text ? { ...m, text: "Sorry — no response from the AI." } : m))
      );
    } catch (err: any) {
      // Replace provisional assistant message with an error message
      setHistory((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, text: `Error: ${err?.message ?? "Network error"}` } : m))
      );
    } finally {
      setLoading(false);
    }
  }

  function handleQuickReply(t: string) {
    handleSend(t);
  }

  // UPDATED: new conversation seed uses a system + assistant message (recommended)
  function handleNewConversation() {
    const base: Message[] = [
      {
        id: uid(),
        role: "system",
        text:
          "You are TriGardening assistant. Be concise, friendly, and give practical plant care advice. If a user attaches an image, describe likely visible issues (spots, pests, mold) and recommend next steps.",
        createdAt: new Date().toISOString(),
      },
      {
        id: uid(),
        role: "assistant",
        text: "Hi! I'm TriGardening assistant. Send a photo of your plant or tell me the problem and I'll help.",
        createdAt: new Date().toISOString(),
      },
    ];

    // replace history with the new base and persist
    setHistory(base);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(base));

    // scroll to top so user sees the new conversation
    setTimeout(() => {
      messagesRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 60);
  }

  const filteredHistory = history.filter((m) =>
    filterQuery ? (m.text ?? "").toLowerCase().includes(filterQuery.toLowerCase()) : true
  );

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className={`w-80 bg-[#0E2D1B]/5 border-r hidden lg:block`}>
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="text-white bg-[#0E2D1B] px-3 py-1 rounded-md font-semibold">TriGardening Chat</div>
            <button onClick={handleNewConversation} className="text-sm px-2 py-1 bg-[#E58E26] text-white rounded-md">New</button>
          </div>

          <div className="mb-3">
            <input
              placeholder="Search history"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full p-2 rounded border text-sm"
            />
          </div>

          <div className="flex-1 overflow-auto space-y-2">
            {filteredHistory
              .filter((m) => m.role === "user" || m.role === "assistant")
              .slice()
              .reverse()
              .map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setHistory((h) => [...h, { id: uid(), role: "assistant", text: `Showing message: ${m.text?.slice(0, 120)}`, createdAt: new Date().toISOString() }]);
                  }}
                  className="w-full text-left p-3 rounded hover:bg-gray-50"
                >
                  <div className="text-sm font-medium text-[#0E2D1B]">
                    {(m.text ?? m.image ?? "Image").slice(0, 50)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{new Date(m.createdAt).toLocaleString()}</div>
                </button>
              ))}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-[#0E2D1B] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#E58E26] flex items-center justify-center font-bold">TG</div>
            <div className="text-lg font-semibold">TriGardening AI</div>
            <div className="text-sm text-white/80 ml-4">Ask plant issues — upload photo for analysis</div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { navigator.clipboard?.writeText(JSON.stringify(history)); }} className="text-sm bg-white/10 px-3 py-1 rounded">Export</button>
            <button onClick={() => { localStorage.removeItem(STORAGE_KEY); setHistory([]); handleNewConversation(); }} className="text-sm bg-white/10 px-3 py-1 rounded">Clear</button>
          </div>
        </div>

        {/* Messages */}
        <div ref={messagesRef} className="flex-1 overflow-auto p-6 space-y-6 bg-gradient-to-b from-white to-gray-50">
          {history.map((m) => (
            <div key={m.id} className={`max-w-3xl ${m.role === "assistant" ? "ml-0" : "ml-auto"} `}>
              <div className={`p-4 rounded-xl ${m.role === "assistant" ? "bg-white border" : "bg-[#E58E26] text-white"}`}>
                {m.image && <img src={m.image} alt="uploaded" className="w-full max-w-md rounded-md mb-3 object-cover" />}
                {m.text && <div className="whitespace-pre-wrap">{m.text}</div>}
                <div className="text-xs text-gray-400 mt-2">{new Date(m.createdAt).toLocaleString()}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="max-w-3xl">
              <div className="p-4 rounded-xl bg-white border animate-pulse">Assistant is typing...</div>
            </div>
          )}
        </div>

        {/* Quick replies */}
        <div className="px-6 pb-3 pt-2 border-t bg-white">
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            {["My plant leaves have yellow spots", "How often should I water succulents?", "Which fertilizer for roses?"].map((q) => (
              <button key={q} onClick={() => handleQuickReply(q)} className="text-sm bg-[#0E2D1B] text-white px-3 py-1 rounded-full whitespace-nowrap">{q}</button>
            ))}
          </div>
        </div>

        {/* Composer */}
        <div className="p-4 bg-white border-t">
          <div className="flex items-center gap-3">
            <label className="cursor-pointer">
              <input type="file" accept="image/*" onChange={onAttachImage} className="hidden" />
              <div className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">📎</div>
            </label>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Describe your issue or ask a question..."
              className="flex-1 p-3 rounded-full border"
            />

            <button onClick={() => handleSend()} disabled={loading} className="bg-[#0E2D1B] text-white px-4 py-2 rounded-full ml-2">
              {loading ? "Sending..." : "Send"}
            </button>
          </div>

          {selectedImage && (
            <div className="mt-3 flex items-center gap-3">
              <img src={selectedImage} alt="preview" className="w-36 h-24 object-cover rounded-md border" />
              <button onClick={() => setSelectedImage(null)} className="text-sm text-red-600">Remove</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
