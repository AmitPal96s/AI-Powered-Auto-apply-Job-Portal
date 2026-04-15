import React from "react";
import { motion } from "framer-motion";
import AISkillGapCard from "../ui/ai/AISkillGapCard";

void motion;

const JobCard = ({ children, className = "", job, userSkills = [] }) => {
  return (
    <motion.div
      className={`rounded-2xl bg-white p-4 shadow-lg transition duration-300 hover:shadow-xl sm:p-6 ${className}`}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      {children}
      {job && (
        <>
          <h2 className="text-base font-semibold sm:text-lg">{job.title}</h2>
          <p className="text-sm text-gray-600">{job.company}</p>
          <AISkillGapCard
            userSkills={userSkills}
            jobSkills={job.requiredSkills || []}
          />
        </>
      )}
    </motion.div>
  );
};

export default JobCard;
