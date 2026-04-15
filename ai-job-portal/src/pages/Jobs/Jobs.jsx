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
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <p className="text-gray-500">Loading jobs...</p>
      </div>
    );
  }

  const renderJobCard = (job) => (
    <div
      key={job._id}
      className="flex h-full flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
    >
      <h3 className="text-base font-semibold sm:text-lg">{job.title}</h3>
      <p className="text-gray-600">{job.company}</p>
      <p className="text-sm text-gray-500">{job.location}</p>

      <p className="mt-1 text-xs uppercase tracking-wide text-gray-400">
        {job.platform || "Unknown"} •{" "}
        {job.applyStrategy || "manual_redirect"}
      </p>

      {typeof job.matchScore === "number" && (
        <p className="text-sm text-blue-600">
          Match Score: {job.matchScore}%
        </p>
      )}

      {job.link && (
        <a
          href={job.link}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex self-start text-sm font-medium text-blue-600 hover:underline"
        >
          View Job
        </a>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 sm:px-6">
      {recommendedJobs.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-bold sm:text-2xl">Recommended Jobs</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {recommendedJobs.map(renderJobCard)}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-4 text-xl font-bold sm:text-2xl">All Jobs</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {jobs.map(renderJobCard)}
        </div>
      </div>
    </div>
  );
}

export default Jobs;
