import { useEffect, useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { getSuggestions } from "../../../services/ai/aiService";
import toast from "react-hot-toast";

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

  // Fetch suggestions on component mount
  useEffect(() => {
    fetchSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skills, profile]);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-5 sm:p-6 transition">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-600" size={24} />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            AI Career Insights
          </h2>
        </div>

        {/* Refresh Button */}
        <button
          onClick={fetchSuggestions}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          aria-label="Refresh Insights"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            ></div>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {!loading && suggestions.length > 0 && (
        <ul className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="bg-purple-50 dark:bg-gray-800 p-3 rounded-xl text-sm sm:text-base text-gray-700 dark:text-gray-200"
            >
              💡 {suggestion}
            </li>
          ))}
        </ul>
      )}

      {/* Empty State */}
      {!loading && suggestions.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No insights available yet. Add your skills, role, and profile details to unlock personalized recommendations.
        </p>
      )}
    </div>
  );
}

export default AIInsightsCard;
