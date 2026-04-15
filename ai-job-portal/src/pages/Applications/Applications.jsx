import { useEffect, useState } from "react";
import { getUserApplications } from "../../services/ai/applicationService";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getUserApplications();
        setApplications(data);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <p className="text-gray-500">Loading applications...</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <p className="text-gray-500">No applications yet.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">My Applications</h1>

      <div className="space-y-4">
        {applications.map((app) => (
          <div
            key={app._id}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
          >
            <h3 className="text-base font-semibold sm:text-lg">
              {app.jobTitle || "Job Title"}
            </h3>
            <p className="text-gray-600">
              {app.company} • {app.location}
            </p>

            <p className="text-sm text-gray-500">
              Match Score: <strong>{app.matchScore}%</strong>
            </p>

            <p className="text-sm text-gray-500">
              Status: {app.status || "Applied"}
            </p>

            <p className="text-sm text-gray-500">
              Submission: {app.submissionStatus}
            </p>

            {app.notes && (
              <p className="mt-2 text-sm text-amber-700">{app.notes}</p>
            )}

            {app.jobLink && (
              <a
                href={app.jobLink}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex text-sm font-medium text-blue-600 hover:underline"
              >
                Open job application
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Applications;
