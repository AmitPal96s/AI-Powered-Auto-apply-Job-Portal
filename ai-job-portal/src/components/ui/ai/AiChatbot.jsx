// src/components/ui/ai/AIChatbot.jsx
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { useAIContext } from "../../../context/AIContext";
import genieIcon from "../../../assets/Ai/genie-icon.png";

function AIChatbot() {
  const { messages, sendChatMessage, loading } = useAIContext();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendChatMessage(input);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 p-3 text-white sm:p-4">
        <img
          src={genieIcon}
          alt="JobGenie Assistant"
          className="h-9 w-9 rounded-full object-contain shadow-lg transition hover:scale-110 sm:h-10 sm:w-10"
        />
        <h2 className="text-sm font-semibold sm:text-base">
          JobGenie AI Assistant
        </h2>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-3 sm:space-y-4 sm:p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            {msg.role === "assistant" && (
              <img
                src={genieIcon}
                alt="JobGenie Assistant"
                className="h-9 w-9 rounded-full object-contain shadow-lg transition hover:scale-110 sm:h-10 sm:w-10"
              />
            )}

          <div
            className={`max-w-[85%] break-words whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm sm:max-w-[75%] sm:px-4 ${
              msg.role === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
              {msg.content}
            </div>

            {msg.role === "user" && (
              <User className="mt-1 text-blue-600" size={18} />
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Bot size={16} />
            <span>JobGenie is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="flex flex-col gap-2 border-t p-3 sm:flex-row sm:p-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask about careers, skills, or interviews..."
          className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-4 sm:py-2.5 sm:text-base"
        />
        <button
          onClick={handleSend}
          className="rounded-xl bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 sm:px-4"
          aria-label="Send Message"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

export default AIChatbot;
