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
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">
        AI Recommended Jobs
      </h2>

      <p className="mb-4 text-sm text-gray-500">
        Based on your skills:{" "}
        <span className="font-medium">
          {combinedSkills.join(", ")}
        </span>
      </p>

      {suggestedSkills.length > 0 && (
        <p className="mb-4 text-sm text-gray-500">
          Suggested next skills:{" "}
          <span className="font-medium">{suggestedSkills.join(", ")}</span>
        </p>
      )}

      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="p-4 border rounded-lg shadow-sm"
          >
            <h3 className="text-lg font-semibold">
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
