// src/context/AIContext.jsx
import { createContext, useContext, useState } from "react";
import { sendMessage, getSuggestions } from "../services/ai/aiService";

// Create the context
const AIContext = createContext();

// Custom hook for easier usage
export const useAIContext = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAIContext must be used within an AIProvider");
  }
  return context;
};

// Provider component
export const AIProvider = ({ children }) => {
  // Chat messages
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm JobGenie AI. How can I help you with your career today?",
    },
  ]);

  // Chat widget state
  const [isChatOpen, setIsChatOpen] = useState(false);

  // AI suggestions
  const [suggestions, setSuggestions] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Toggle chat widget
  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  // Send a message to the AI chatbot
  const sendChatMessage = async (userInput) => {
    if (!userInput.trim()) return;

    const userMessage = { role: "user", content: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const aiReply = await sendMessage([...messages, userMessage]);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            typeof aiReply === "string"
              ? aiReply
              : aiReply?.reply || "I could not generate a response just now.",
        },
      ]);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch AI response.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch AI suggestions
  const fetchSuggestions = async (skills, profile = {}) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getSuggestions(skills, profile);
      setSuggestions(Array.isArray(data) ? data : data?.suggestions || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch AI suggestions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AIContext.Provider
      value={{
        messages,
        isChatOpen,
        suggestions,
        loading,
        error,
        toggleChat,
        sendChatMessage,
        fetchSuggestions,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};
