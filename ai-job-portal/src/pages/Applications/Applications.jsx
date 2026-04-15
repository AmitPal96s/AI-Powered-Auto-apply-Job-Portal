import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getUserApplications } from "../../services/ai/applicationService";

void motion;

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
      <motion.div
        className="mx-auto max-w-6xl px-4 py-6 sm:px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-gray-500">Loading applications...</p>
      </motion.div>
    );
  }

  if (applications.length === 0) {
    return (
      <motion.div
        className="mx-auto max-w-6xl px-4 py-6 sm:px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-gray-500">No applications yet.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="mx-auto max-w-6xl px-4 py-6 sm:px-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">My Applications</h1>

      <motion.div
        className="space-y-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.07 } },
        }}
      >
        {applications.map((app) => (
          <motion.div
            key={app._id}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-base font-semibold sm:text-lg">
              {app.jobTitle || "Job Title"}
            </h3>
            <p className="text-gray-600">
              {app.company} - {app.location}
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
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default Applications;