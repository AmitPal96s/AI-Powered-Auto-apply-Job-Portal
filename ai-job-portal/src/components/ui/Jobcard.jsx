import React from "react";
import AISkillGapCard from "../ui/ai/AISkillGapCard";

const JobCard = ({ children, className = "", job, userSkills = [] }) => {
  return (
    <div className={`rounded-2xl bg-white p-4 shadow-lg transition duration-300 hover:shadow-xl sm:p-6 ${className}`}>
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
    </div>
  );
};

export default JobCard;
