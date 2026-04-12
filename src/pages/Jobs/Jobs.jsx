import React, { useState } from "react";
import toast from "react-hot-toast";
function Jobs() {
  const [tab, setTab] = useState("recommended");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [autoMode, setAutoMode] = useState(false);

  const userSkills =
    localStorage.getItem("skills")?.split(",").map((s) => s.trim()) || [];

  const applyJob = (job) => {
  setAppliedJobs([...appliedJobs, job.title]);
  toast.success(`Applied to ${job.title}`);
};

  const jobs = [
    { title: "Frontend Developer", location: "Remote", skills: "React, HTML, CSS" },
    { title: "Backend Developer", location: "Bangalore", skills: "Node.js, Express" },
    { title: "Data Analyst", location: "Hybrid", skills: "SQL, Excel" },
  ]
    .map((job) => {
      let match = 0;
      userSkills.forEach((skill) => {
        if (job.skills.toLowerCase().includes(skill.toLowerCase())) {
          match += 40;
        }
      });
      if (match > 100) match = 100;
      return { ...job, match };
    })
    .sort((a, b) => b.match - a.match);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4 sm:px-6 md:px-10 lg:px-16 py-6">

      {/* Header */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent text-center sm:text-left">
        AI Job Portal - Find Your Perfect Match
      </h1>

      <p className="text-gray-600 mb-6 text-sm sm:text-base text-center sm:text-left">
        Discover recommended jobs or let AI automatically apply on your behalf.
      </p>

      {/* Applied Jobs Counter */}
      <div className="mb-4 text-gray-700 text-center sm:text-left">
        Applied Jobs: <span className="font-semibold">{appliedJobs.length}</span>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 mb-8">
        <button
          onClick={() => setTab("recommended")}
          className={`w-full sm:w-auto px-5 py-3 rounded-2xl transition ${tab === "recommended"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700"
            }`}
        >
          Recommended Jobs
        </button>

        <button
          onClick={() => setTab("auto")}
          className={`w-full sm:w-auto px-5 py-3 rounded-2xl transition ${tab === "auto"
            ? "bg-pink-500 text-white"
            : "bg-gray-200 text-gray-700"
            }`}
        >
          Auto Apply Center
        </button>

        <button
          onClick={() => setAutoMode(!autoMode)}
          className={`w-full sm:w-auto px-5 py-3 rounded-2xl transition ${autoMode
            ? "bg-green-600 text-white"
            : "bg-gray-200 text-gray-700"
            }`}
        >
          {autoMode ? "Auto Apply ON" : "Auto Apply OFF"}
        </button>
      </div>

      {/* Recommended Jobs Section */}
      {tab === "recommended" && (
        <div className="mt-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center sm:text-left">
            Recommended Jobs
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => (
              <div
                key={index}
                className="bg-white p-5 sm:p-6 rounded-3xl shadow-lg hover:shadow-xl transition"
              >
                <h3 className="text-lg sm:text-xl font-bold">{job.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {job.location} • {job.skills}
                </p>
                <p className="mt-2 text-green-600 font-semibold">
                  {job.match}% Match
                </p>
                <div className="mt-4 flex justify-start">
                  <button
                    onClick={() => applyJob(job)}
                    className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white rounded-lg hover:opacity-90 transition duration-300 shadow-md hover:shadow-lg"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Auto Apply Center Section */}
      {tab === "auto" && (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-3xl shadow-lg text-center">
              <h2 className="text-gray-500 text-sm sm:text-base">
                Jobs Found Today
              </h2>
              <p className="text-3xl sm:text-4xl font-bold mt-2">34</p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-lg text-center">
              <h2 className="text-gray-500 text-sm sm:text-base">
                Auto Applied
              </h2>
              <p className="text-3xl sm:text-4xl font-bold mt-2">
                {appliedJobs.length}
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-lg text-center">
              <h2 className="text-gray-500 text-sm sm:text-base">
                Interviews
              </h2>
              <p className="text-3xl sm:text-4xl font-bold mt-2">2</p>
            </div>
          </div>

          {/* Platform Selection */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-lg mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">
              Platforms
            </h2>
            <div className="flex flex-wrap justify-center sm:justify-start gap-3">
              {["LinkedIn", "Indeed", "Naukri", "Wellfound"].map(
                (platform) => (
                  <button
                    key={platform}
                    className="px-4 py-2 rounded-xl bg-blue-100 hover:bg-blue-200 transition"
                  >
                    {platform}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Auto Apply Status */}
          {autoMode && (
            <div className="mt-8 p-5 sm:p-6 bg-white rounded-3xl shadow-lg text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold mb-3">
                AI Auto Apply Running...
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Scanning jobs based on your profile and applying automatically.
              </p>
              <div className="mt-4 text-green-600 font-semibold">
                Jobs Applied: {appliedJobs.length}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Jobs;