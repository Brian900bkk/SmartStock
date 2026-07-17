import { useState, useRef, useEffect } from "react";
import api from "../../services/api";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

function AI() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello 👋 I'm SmartStock AI. Ask me about products, sales, customers or inventory.",
    },
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const currentMessage = message;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: currentMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/ai", {
        message: currentMessage,
      });

      console.log("AI Response:", res.data);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: res.data.reply,
        },
      ]);
    } catch (err) {
      console.error("AI Error:", err);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text:
            err.response?.data?.reply ||
            err.response?.data?.message ||
            "Unable to get a response from SmartStock AI.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      <div className="ml-64">
        <Navbar />

        <div className="p-8">

          <h1 className="text-3xl font-bold mb-6">
            🤖 SmartStock AI Assistant
          </h1>

          <div className="bg-white rounded-xl shadow-lg h-[600px] flex flex-col">

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xl px-5 py-3 rounded-2xl ${
                      msg.sender === "user"
                        ? "bg-sky-600 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="text-gray-500 italic">
                  SmartStock AI is thinking...
                </div>
              )}

              <div ref={messagesEndRef}></div>

            </div>

            {/* Input */}
            <div className="border-t p-4 flex gap-3">

              <input
                type="text"
                placeholder="Ask SmartStock AI..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                className="flex-1 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />

              <button
                onClick={sendMessage}
                disabled={loading}
                className="bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white px-6 rounded-lg transition"
              >
                {loading ? "Sending..." : "Send"}
              </button>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default AI;