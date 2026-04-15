import { useEffect, useState } from "react";
import { getRecommendedJobs } from "../../../services/jobService";

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
    <div className="rounded-2xl bg-white p-4 shadow-md dark:bg-gray-900 sm:p-6">
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
          <div
            key={job._id}
            className="rounded-2xl border border-gray-100 p-4 shadow-sm"
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default AIRecommendedJobs;
