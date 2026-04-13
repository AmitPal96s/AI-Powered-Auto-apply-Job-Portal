// src/components/ui/ai/AIRejectionFeedback.jsx
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { getRejectionFeedback } from "../../../services/ai/aiService";
import toast from "react-hot-toast";

function AIRejectionFeedback({ jobTitle, company, userSkills = [] }) {
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateFeedback = async () => {
    if (!jobTitle || !company) {
      toast.error("Job details are missing.");
      return;
    }

    setLoading(true);
    try {
      const result = await getRejectionFeedback(
        jobTitle,
        company,
        userSkills
      );
      setFeedback(result);
      toast.success("AI feedback generated!");
    } catch (error) {
      console.error("Error generating feedback:", error);
      toast.error("Failed to generate feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-red-50 dark:bg-gray-800 border border-red-200 dark:border-gray-700 rounded-2xl p-4 mt-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="text-red-500" size={20} />
        <h3 className="font-semibold text-gray-800 dark:text-white">
          Application Feedback
        </h3>
      </div>

      {!feedback ? (
        <button
          onClick={handleGenerateFeedback}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          aria-label="Generate AI feedback"
        >
          {loading ? "Generating..." : "Get AI Feedback"}
        </button>
      ) : (
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {feedback}
        </p>
      )}
    </div>
  );
}

export default AIRejectionFeedback;