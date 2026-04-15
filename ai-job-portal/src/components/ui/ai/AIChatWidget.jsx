// src/components/ui/ai/AIChatWidget.jsx
import { X } from "lucide-react";
import { useAIContext } from "../../../context/AIContext";
import AIChatbot from "./AiChatbot";
import genieIcon from "../../../assets/Ai/genie-icon.png";

function AIChatWidget() {
  const { isChatOpen, toggleChat } = useAIContext();

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg transition duration-300 hover:scale-105 focus:outline-none sm:bottom-6 sm:right-6"
        aria-label="Toggle AI Chat"
      >
        {isChatOpen ? (
          <div className="rounded-full bg-white p-3 shadow-md dark:bg-gray-800">
            <X size={22} className="text-gray-700 dark:text-white" />
          </div>
        ) : (
          <img
            src={genieIcon}
            alt="JobGenie Assistant"
            className="h-14 w-14 rounded-full object-contain shadow-lg ring-4 ring-purple-200 dark:ring-purple-800 sm:h-16 sm:w-16"
          />
        )}
      </button>

      {isChatOpen && (
        <div className="fixed bottom-20 left-4 right-4 z-50 h-[min(72vh,34rem)] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900 sm:bottom-24 sm:left-auto sm:right-6 sm:h-[70vh] sm:w-96">
          <AIChatbot />
        </div>
      )}
    </>
  );
}

export default AIChatWidget;
