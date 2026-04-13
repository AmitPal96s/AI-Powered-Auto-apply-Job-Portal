// src/components/ui/ai/AIChatWidget.jsx
import { X } from "lucide-react";
import { useAIContext } from "../../../context/AIContext";
import AIChatbot from "./AiChatbot";
import genieIcon from "../../../assets/Ai/genie-icon.png";

function AIChatWidget() {
  const { isChatOpen, toggleChat } = useAIContext();

  return (
    <>
      {/* Floating Genie Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg hover:scale-105 transition duration-300 focus:outline-none"
        aria-label="Toggle AI Chat"
      >
        {isChatOpen ? (
          <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-md">
            <X size={24} className="text-gray-700 dark:text-white" />
          </div>
        ) : (
          <img
            src={genieIcon}
            alt="JobGenie Assistant"
className="w-16 h-16 object-contain rounded-full shadow-lg ring-4 ring-purple-200 dark:ring-purple-800"          />
        )}
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[90vw] sm:w-96 h-[70vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <AIChatbot />
        </div>
      )}
    </>
  );
}

export default AIChatWidget;