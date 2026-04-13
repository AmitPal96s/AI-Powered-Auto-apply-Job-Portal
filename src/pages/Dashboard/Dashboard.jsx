import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import AIInsightsCard from "../../components/ui/ai/AIInsightsCard";

function Dashboard() {
  const [stats, setStats] = useState({
    applied: 0,
    matches: 0,
    interviews: 0,
    autoApply: false,
  });
  const userSkills =
    localStorage.getItem("skills")
      ?.split(",")
      .map((skill) => skill.trim()) || ["React", "Node.js", "MongoDB"];

  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    // Fetch data from localStorage (can later be replaced with API calls)
    const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs")) || [];
    const autoApply = JSON.parse(localStorage.getItem("autoApply")) || false;

    setStats({
      applied: appliedJobs.length,
      matches: 12, // Placeholder for now
      interviews: 2, // Placeholder for now
      autoApply: autoApply,
    });

    setRecentJobs(appliedJobs.slice(-3).reverse());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent">
          Welcome Back 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Track your job applications and manage your AI job hunt.
        </p>
        <AIInsightsCard skills={userSkills} />
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Jobs Applied" value={stats.applied} />
        <StatCard title="Matches Found" value={stats.matches} />
        <StatCard title="Interviews" value={stats.interviews} />
        <StatCard
          title="Auto Apply"
          value={stats.autoApply ? "ON" : "OFF"}
        />
      </div>

      {/* Quick Actions */}
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
            className="bg-purple-600 text-white px-5 py-3 rounded-xl hover:opacity-90 transition"
            onClick={() => alert("Resume upload feature coming soon!")}
          >
            Upload Resume
          </button>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white p-6 rounded-3xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Recent Applications</h2>
        {recentJobs.length === 0 ? (
          <p className="text-gray-500">No applications yet.</p>
        ) : (
          <ul className="space-y-4">
            {recentJobs.map((job, index) => (
              <li
                key={index}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="font-medium">{job}</span>
                <span className="text-sm text-green-600">Applied</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Reusable Stat Card Component
function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg text-center">
      <h3 className="text-gray-500">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

export default Dashboard;