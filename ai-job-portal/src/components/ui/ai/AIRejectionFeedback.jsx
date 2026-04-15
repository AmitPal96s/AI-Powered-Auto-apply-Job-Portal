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
    <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle className="text-red-500" size={20} />
        <h3 className="font-semibold text-gray-800">
          Application Feedback
        </h3>
      </div>

      {!feedback ? (
        <button
          onClick={handleGenerateFeedback}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white transition hover:bg-red-600"
          aria-label="Generate AI feedback"
        >
          {loading ? "Generating..." : "Get AI Feedback"}
        </button>
      ) : (
        <p className="text-sm leading-relaxed text-gray-700">
          {feedback}
        </p>
      )}
    </div>
  );
}

export default AIRejectionFeedback;
