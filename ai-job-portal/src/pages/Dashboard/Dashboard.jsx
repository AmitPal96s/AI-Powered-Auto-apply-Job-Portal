import { Link } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import AIInsightsCard from "../../components/ui/ai/AIInsightsCard";
import {
  autoApplyToJobs,
  getUserApplications,
} from "../../services/ai/applicationService";
import toast from "react-hot-toast";
import { Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-gray-600 mt-2">
          Track your job applications and manage your AI job hunt.
        </p>
        <AIInsightsCard skills={userSkills} profile={userProfile} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Jobs Applied" value={stats.applied} />
        <StatCard title="Strong Matches" value={stats.matches} />
        <StatCard title="Interviews" value={stats.interviews} />
        <StatCard title="Auto Apply" value={stats.autoApply ? "ON" : "OFF"} />
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-lg mb-10">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/profile"
            className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:opacity-90 transition"
          >
            Update Profile
          </Link>
          <Link
            to="/jobs"
            className="bg-pink-500 text-white px-5 py-3 rounded-xl hover:opacity-90 transition"
          >
            View Recommended Jobs
          </Link>
          <button
            onClick={handleAutoApply}
            disabled={loading}
            className="bg-purple-600 text-white px-5 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
          >
            <Sparkles size={18} />
            {loading ? "Applying..." : "Auto Apply"}
          </button>
        </div>
        {!user?.preferences?.autoApplyEnabled && (
          <p className="mt-4 text-sm text-amber-700">
            Auto apply is off. Turn it on from your profile to let the system apply to matching jobs.
          </p>
        )}
        {lastAutoApplySummary && (
          <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-gray-700">
            Scanned <strong>{lastAutoApplySummary.totalJobsScanned}</strong> jobs and created <strong>{lastAutoApplySummary.totalApplied}</strong> new applications.
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Recent Applications</h2>
        {pageLoading ? (
          <p className="text-gray-500">Loading applications...</p>
        ) : recentApplications.length === 0 ? (
          <p className="text-gray-500">No applications yet.</p>
        ) : (
          <ul className="space-y-4">
            {recentApplications.map((application) => (
              <li
                key={application._id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="font-medium">{application.jobTitle}</span>
                <span className="text-sm text-green-600">{application.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg text-center">
      <h3 className="text-gray-500">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

export default Dashboard;
