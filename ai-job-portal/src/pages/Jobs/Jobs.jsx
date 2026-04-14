import { useEffect, useState } from "react";
import { getAllJobs, getRecommendedJobs } from "../../services/jobs/jobService";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const [allJobs, recommended] = await Promise.all([
          getAllJobs(),
          getRecommendedJobs(),
        ]);
        setJobs(allJobs);
        setRecommendedJobs(recommended.recommendedJobs || []);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-gray-500">Loading jobs...</p>
      </div>
    );
  }

  const renderJobCard = (job) => (
    <div
      key={job._id}
      className="p-4 border rounded-lg shadow-sm bg-white"
    >
      <h3 className="text-lg font-semibold">{job.title}</h3>
      <p className="text-gray-600">{job.company}</p>
      <p className="text-sm text-gray-500">{job.location}</p>

      <p className="mt-1 text-xs uppercase tracking-wide text-gray-400">
        {job.platform || "Unknown"} •{" "}
        {job.applyStrategy || "manual_redirect"}
      </p>

      {typeof job.matchScore === "number" && (
        <p className="mt-2 text-sm text-blue-600">
          Match Score: {job.matchScore}%
        </p>
      )}

      {job.link && (
        <a
          href={job.link}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
        >
          View Job
        </a>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {recommendedJobs.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Recommended Jobs</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {recommendedJobs.map(renderJobCard)}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold mb-4">All Jobs</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map(renderJobCard)}
        </div>
      </div>
    </div>
  );
}

export default Jobs;
