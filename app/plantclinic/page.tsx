// app/ai-chat/page.tsx
import ChatClient from "./ChatClient";

export const metadata = {
  title: "AI Chatbot - TriGardening",
};

export default function AIPage() {
  return (
    <main className="min-h-screen bg-[#F6F6EE] pt-24">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#0E2D1B] mb-6">AI Chatbot</h1>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <ChatClient />
        </div>
      </div>
    </main>
  );
}
