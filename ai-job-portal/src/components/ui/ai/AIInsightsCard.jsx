import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw } from "lucide-react";
import { getSuggestions } from "../../../services/ai/aiService";
import toast from "react-hot-toast";

void motion;

function AIInsightsCard({ skills = [], profile = {} }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const data = await getSuggestions(skills, profile);
      setSuggestions(Array.isArray(data) ? data : data?.suggestions || []);
      toast.success("AI insights generated!");
    } catch (error) {
      toast.error(error.message || "Failed to fetch AI insights.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skills, profile]);

  return (
    <motion.div
      className="rounded-2xl bg-white p-4 shadow-lg transition sm:p-6"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-600" size={22} />
          <h2 className="text-base font-semibold text-gray-800 sm:text-xl">
            AI Career Insights
          </h2>
        </div>

        <motion.button
          onClick={fetchSuggestions}
          className="rounded-full bg-gray-100 p-2 text-gray-700 transition hover:bg-gray-200"
          aria-label="Refresh Insights"
          whileHover={{ rotate: 45, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw size={18} />
        </motion.button>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-4 animate-pulse rounded bg-gray-200"></div>
          ))}
        </div>
      )}

      {!loading && suggestions.length > 0 && (
        <ul className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <motion.li
              key={index}
              className="rounded-xl bg-purple-50 p-3 text-sm text-gray-700 sm:text-base"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
            >
              Tip: {suggestion}
            </motion.li>
          ))}
        </ul>
      )}

      {!loading && suggestions.length === 0 && (
        <p className="text-sm text-gray-500">
          No insights available yet. Add your skills, role, and profile details to unlock personalized recommendations.
        </p>
      )}
    </motion.div>
  );
}

export default AIInsightsCard;
