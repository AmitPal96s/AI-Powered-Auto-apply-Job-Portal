// src/components/ui/ai/AIRejectionFeedback.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { getRejectionFeedback } from "../../../services/ai/aiService";
import toast from "react-hot-toast";

void motion;

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
    <motion.div
      className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle className="text-red-500" size={20} />
        <h3 className="font-semibold text-gray-800">
          Application Feedback
        </h3>
      </div>

      {!feedback ? (
        <motion.button
          onClick={handleGenerateFeedback}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white transition hover:bg-red-600"
          aria-label="Generate AI feedback"
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? "Generating..." : "Get AI Feedback"}
        </motion.button>
      ) : (
        <p className="text-sm leading-relaxed text-gray-700">
          {feedback}
        </p>
      )}
    </motion.div>
  );
}

export default AIRejectionFeedback;
