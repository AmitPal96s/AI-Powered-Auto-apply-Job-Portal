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
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-gray-500">Loading applications...</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-gray-500">No applications yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>

      <div className="space-y-4">
        {applications.map((app) => (
          <div
            key={app._id}
            className="p-4 border rounded-lg shadow-sm bg-white"
          >
            <h3 className="text-lg font-semibold">
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
                className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
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