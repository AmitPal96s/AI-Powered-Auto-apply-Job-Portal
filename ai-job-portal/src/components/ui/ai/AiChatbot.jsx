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
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white">
        <img
          src={genieIcon}
          alt="JobGenie Assistant"
          className="w-10 h-10 object-contain rounded-full shadow-lg hover:scale-110 transition"
        />
        <h2 className="font-semibold">JobGenie AI Assistant</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                className="w-10 h-10 object-contain rounded-full shadow-lg hover:scale-110 transition"
              />
            )}

            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${msg.role === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-100  text-gray-800 "
                }`}
            >
              {msg.content}
            </div>

            {msg.role === "user" && (
              <User className="text-blue-600 mt-1" size={18} />
            )}
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Bot size={16} />
            <span>JobGenie is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="p-4 border-t dark:border-gray-700 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask about careers, skills, or interviews..."
          className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition"
          aria-label="Send Message"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

export default AIChatbot;