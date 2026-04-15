import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getRecommendedJobs } from "../../../services/jobService";

void motion;

function AIRecommendedJobs() {
  const [jobs, setJobs] = useState([]);
  const [combinedSkills, setCombinedSkills] = useState([]);
  const [suggestedSkills, setSuggestedSkills] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getRecommendedJobs();
        setJobs(data.recommendedJobs || []);
        setCombinedSkills(data.combinedSkills || []);
        setSuggestedSkills(data.suggestedSkills || []);
      } catch (error) {
        console.error("Error fetching recommended jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <motion.div
      className="rounded-2xl bg-white p-4 shadow-md sm:p-6"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <h2 className="mb-4 text-xl font-semibold sm:text-2xl">
        AI Recommended Jobs
      </h2>

      <p className="mb-4 text-sm text-gray-500">
        Based on your skills:{" "}
        <span className="block break-words font-medium sm:inline">
          {combinedSkills.join(", ")}
        </span>
      </p>

      {suggestedSkills.length > 0 && (
        <p className="mb-4 text-sm text-gray-500">
          Suggested next skills:{" "}
          <span className="block break-words font-medium sm:inline">
            {suggestedSkills.join(", ")}
          </span>
        </p>
      )}

      <div className="space-y-3 sm:space-y-4">
        {jobs.map((job) => (
          <motion.div
            key={job._id}
            className="rounded-2xl border border-gray-100 p-4 shadow-sm"
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-base font-semibold sm:text-lg">
              {job.title}
            </h3>
            <p className="text-gray-600">{job.company}</p>
            <p className="text-sm text-gray-500">
              Match Score:{" "}
              <span className="text-blue-600 font-semibold">
                {job.matchScore}%
              </span>
            </p>
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View Job
            </a>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default AIRecommendedJobs;
