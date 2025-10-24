"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const API_URL = "https://api-endpoint-link"; // Replace with your FastAPI endpoint

type Message = {
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean; // For the animated typing state
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string>("");
  const chatRef = useRef<HTMLDivElement>(null);

  // Generate unique session ID per browser tab
  useEffect(() => {
    let existingSession = sessionStorage.getItem("chat_session_id");
    if (!existingSession) {
      existingSession = crypto.randomUUID();
      sessionStorage.setItem("chat_session_id", existingSession);
    }
    setSessionId(existingSession);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return;

    const newMessage: Message = { role: "user", content: input };
    setMessages((m) => [...m, newMessage]);
    setInput("");

    // Add Arabic "typing..." placeholder with animation
    setMessages((m) => [
      ...m,
      { role: "assistant", content: "جارٍ الكتابة", isTyping: true },
    ]);

    const res = await fetch(`${API_URL}/query_stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, question: input }),
    });

    const reader = res.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      setMessages((m): Message[] => {
        if (m.length === 0) return [{ role: "assistant", content: chunk }];

        const last = m[m.length - 1];

        if (last.role === "assistant" && last.isTyping) {
          // Replace animated placeholder with first real chunk
          return [
            ...m.slice(0, -1),
            { role: "assistant", content: chunk, isTyping: false },
          ];
        }

        if (last.role === "assistant") {
          // Append further chunks
          return [
            ...m.slice(0, -1),
            { role: "assistant", content: last.content + chunk },
          ];
        }

        return [...m, { role: "assistant", content: chunk }];
      });

      chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <main
      dir="rtl"
      className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6"
    >
      <div className="w-full max-w-2xl bg-white shadow-md rounded-2xl p-4 flex flex-col h-[80vh]">
        {/* Introductory text */}
        <div className="mb-4 p-2 text-center text-gray-700 bg-gray-100 rounded-xl">
          مرحباً! هذا التطبيق يسمح لك بالدردشة مع مساعد ذكي. اكتب سؤالك أدناه وسيتم الرد عليك مباشرة.
        </div>

        {/* Chat messages */}
        <div ref={chatRef} className="flex-1 overflow-y-auto mb-4 space-y-2">
          {messages.length === 0 && (
            <div className="text-gray-400 text-center mt-4">
              لا توجد رسائل بعد. ابدأ بطرح سؤال!
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 rounded-2xl max-w-[80%] break-words ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white text-right"
                    : "bg-gray-100 text-gray-900 text-left"
                }`}
              >
                {msg.isTyping ? (
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <span>جارٍ الكتابة</span>
                    <span className="dots ml-1">...</span>
                  </div>
                ) : (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input + buttons */}
        <div className="flex space-x-2 rtl:space-x-reverse">
          <input
            className="flex-1 border rounded-xl p-2 text-black placeholder-gray-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="اكتب سؤالك هنا..."
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-xl"
            onClick={sendMessage}
          >
            إرسال
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-xl"
            onClick={clearChat}
          >
            مسح الدردشة
          </button>
        </div>
      </div>

      {/* 🔹 Animated dots keyframes */}
      <style jsx>{`
        @keyframes dots {
          0%,
          20% {
            content: "";
          }
          40% {
            content: ".";
          }
          60% {
            content: "..";
          }
          80%,
          100% {
            content: "...";
          }
        }
        .dots::after {
          display: inline-block;
          text-align: left;
          animation: dots 1.5s steps(4, end) infinite;
          content: "";
        }
      `}</style>
    </main>
  );
}
