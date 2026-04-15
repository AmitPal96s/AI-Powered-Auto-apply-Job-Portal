import { Link } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import AIInsightsCard from "../../components/ui/ai/AIInsightsCard";
import {
  autoApplyToJobs,
  getUserApplications,
} from "../../services/ai/applicationService";
import toast from "react-hot-toast";
import { Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

void motion;

function Dashboard() {
  const { user } = useAuth();
  const avatarUrl = user?.profile?.avatarUrl || "";
  const displayName = user?.name || "There";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  const [stats, setStats] = useState({
    applied: 0,
    matches: 0,
    interviews: 0,
    autoApply: false,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [lastAutoApplySummary, setLastAutoApplySummary] = useState(null);

  const userSkills = useMemo(() => user?.skills || [], [user]);
  const userProfile = useMemo(() => user?.profile || {}, [user]);

  const loadApplications = useCallback(async () => {
    try {
      const applications = await getUserApplications();
      const interviews = applications.filter(
        (application) => application.status === "Interview"
      ).length;

      setStats({
        applied: applications.length,
        matches: applications.filter((application) => application.matchScore >= 70).length,
        interviews,
        autoApply: Boolean(user?.preferences?.autoApplyEnabled),
      });

      setRecentApplications(applications.slice(0, 3));
    } catch (error) {
      toast.error(error.message || "Failed to load dashboard data");
    } finally {
      setPageLoading(false);
    }
  }, [user]);

  const handleAutoApply = async () => {
    setLoading(true);
    try {
      const data = await autoApplyToJobs();
      setLastAutoApplySummary(data);
      toast.success(`Successfully auto-applied to ${data.totalApplied || 0} jobs!`);
      await loadApplications();
    } catch (error) {
      toast.error(error.message || "Auto apply failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4 py-6 sm:px-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <motion.div
        className="mb-6 rounded-3xl bg-white p-4 shadow-lg sm:mb-8 sm:p-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold leading-tight bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent sm:text-4xl">
              Welcome Back, {displayName}
            </h1>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Track your job applications and manage your AI job hunt.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3 sm:gap-4 sm:px-4">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-pink-100 text-lg font-bold text-blue-700 sm:h-16 sm:w-16 sm:text-xl">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={`${displayName} avatar`}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials || "U"
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Profile</p>
              <p className="text-sm font-semibold text-gray-900 sm:text-base">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        <motion.div
          className="mt-5 sm:mt-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <AIInsightsCard skills={userSkills} profile={userProfile} />
        </motion.div>
      </motion.div>

      <motion.div
        className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
      >
        <StatCard title="Jobs Applied" value={stats.applied} />
        <StatCard title="Strong Matches" value={stats.matches} />
        <StatCard title="Interviews" value={stats.interviews} />
        <StatCard title="Auto Apply" value={stats.autoApply ? "ON" : "OFF"} />
      </motion.div>

      <motion.div
        className="mb-8 rounded-3xl bg-white p-4 shadow-lg sm:p-6"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.35 }}
      >
        <h2 className="mb-4 text-xl font-bold sm:text-2xl">Quick Actions</h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
          <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/profile"
              className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-white transition hover:opacity-90 sm:w-auto"
            >
              Update Profile
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/jobs"
              className="inline-flex w-full items-center justify-center rounded-xl bg-pink-500 px-5 py-3 text-white transition hover:opacity-90 sm:w-auto"
            >
              View Recommended Jobs
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <button
              onClick={handleAutoApply}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-white transition hover:opacity-90 disabled:opacity-50 sm:w-auto"
            >
              <Sparkles size={18} />
              {loading ? "Applying..." : "Auto Apply"}
            </button>
          </motion.div>
        </div>
        {!user?.preferences?.autoApplyEnabled && (
          <p className="mt-4 text-sm text-amber-700">
            Auto apply is off. Turn it on from your profile to let the system apply to matching jobs.
          </p>
        )}
        {lastAutoApplySummary && (
          <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm leading-relaxed text-gray-700">
            Scanned <strong>{lastAutoApplySummary.totalJobsScanned}</strong> jobs and created <strong>{lastAutoApplySummary.totalApplied}</strong> new applications.
          </div>
        )}
      </motion.div>

      <motion.div
        className="rounded-3xl bg-white p-4 shadow-lg sm:p-6"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.35 }}
      >
        <h2 className="mb-4 text-xl font-bold sm:text-2xl">Recent Applications</h2>
        {pageLoading ? (
          <p className="text-gray-500">Loading applications...</p>
        ) : recentApplications.length === 0 ? (
          <p className="text-gray-500">No applications yet.</p>
        ) : (
          <ul className="space-y-3 sm:space-y-4">
            {recentApplications.map((application) => (
              <li
                key={application._id}
                className="flex flex-col gap-1 border-b border-gray-100 pb-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-medium">{application.jobTitle}</span>
                <span className="text-sm text-green-600">{application.status}</span>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </motion.div>
  );
}

function StatCard({ title, value }) {
  return (
    <motion.div
      className="rounded-3xl bg-white p-4 text-center shadow-lg sm:p-6"
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <h3 className="text-sm text-gray-500 sm:text-base">{title}</h3>
      <p className="mt-2 text-2xl font-bold sm:text-3xl">{value}</p>
    </motion.div>
  );
}

export default Dashboard;
