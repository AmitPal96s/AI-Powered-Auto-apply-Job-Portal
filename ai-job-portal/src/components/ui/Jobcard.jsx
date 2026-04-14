import React from "react";
import AISkillGapCard from "../ui/ai/AISkillGapCard";

const JobCard = ({ children, className = "", job, userSkills = [] }) => {
  return (
    <div className={`bg-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition duration-300 ${className}`}>
      {children}
      {job && (
        <>
          <h2 className="text-lg font-semibold">{job.title}</h2>
          <p className="text-sm text-gray-600">{job.company}</p>
          <AISkillGapCard
            userSkills={userSkills}
            jobSkills={job.requiredSkills || []}
          />
        </>
      )}
    </div>
  );
};

export default JobCard;
