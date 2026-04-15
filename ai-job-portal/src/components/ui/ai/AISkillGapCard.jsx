// src/components/ui/ai/AISkillGapCard.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { getSkillGap } from "../../../services/ai/aiService";
import toast from "react-hot-toast";

void motion;

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
    <motion.div
      className="mt-4 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mb-2 flex items-center gap-2">
        <Lightbulb className="text-yellow-500" size={20} />
        <h3 className="font-semibold text-gray-800">
          Skill Gap Analysis
        </h3>
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="h-4 rounded bg-gray-200"></div>
          <div className="h-4 rounded bg-gray-200"></div>
        </div>
      ) : (
        <ul className="list-disc list-inside text-sm text-gray-700">
          {missingSkills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

export default AISkillGapCard;
