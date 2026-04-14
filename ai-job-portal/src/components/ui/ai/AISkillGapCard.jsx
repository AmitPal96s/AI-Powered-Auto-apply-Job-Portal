// src/components/ui/ai/AISkillGapCard.jsx
import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";
import { getSkillGap } from "../../../services/ai/aiService";
import toast from "react-hot-toast";

function AISkillGapCard({ userSkills = [], jobSkills = [] }) {
  const [missingSkills, setMissingSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const analyzeSkills = async () => {
      if (!userSkills.length || !jobSkills.length) return;

      setLoading(true);
      try {
        const result = await getSkillGap(userSkills, jobSkills);
        setMissingSkills(result);
      } catch (error) {
        console.error("Skill gap analysis failed:", error);
        toast.error("Unable to analyze skill gap.");
      } finally {
        setLoading(false);
      }
    };

    analyzeSkills();
  }, [userSkills, jobSkills]);

  // If no missing skills and not loading, don't render the card
  if (!loading && missingSkills.length === 0) return null;

  return (
    <div className="mt-4 bg-yellow-50 dark:bg-gray-800 border border-yellow-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="text-yellow-500" size={20} />
        <h3 className="font-semibold text-gray-800 dark:text-white">
          Skill Gap Analysis
        </h3>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      ) : (
        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
          {missingSkills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AISkillGapCard;
