const axios = require("axios");
const Job = require("../models/job");
const { detectApplyStrategy } = require("./applicationExecutors");

const extractSkills = (description = "") => {
  const skills = [
    "javascript",
    "react",
    "node",
    "mongodb",
    "python",
    "java",
  ];
  return skills.filter((skill) =>
    description.toLowerCase().includes(skill)
  );
};

const fetchJobsFromAPI = async () => {
  try {
    const response = await axios.get(
      process.env.REMOTIVE_API_URL ||
        "https://remotive.com/api/remote-jobs"
    );

    const jobs = response.data.jobs.map((job) => {
      const applyMetadata = detectApplyStrategy(job.url);

      return {
        title: job.title,
        company: job.company_name,
        location: job.candidate_required_location,
        description: job.description,
        link: job.url,
        source: "API",
        platform: applyMetadata.platform,
        applyStrategy: applyMetadata.applyStrategy,
        externalApplySupported:
          applyMetadata.externalApplySupported,
        requiredSkills: extractSkills(job.description),
        salary: job.salary || "Not specified",
        postedDate: new Date(job.publication_date),
      };
    });

    for (const job of jobs) {
      await Job.findOneAndUpdate(
        { link: job.link },
        job,
        { upsert: true, new: true }
      );
    }

    console.log("Jobs fetched and stored successfully");
  } catch (error) {
    console.error("Error fetching jobs:", error.message);
  }
};

const ensureJobsLoaded = async () => {
  const existingJobsCount = await Job.countDocuments();

  if (existingJobsCount === 0) {
    await fetchJobsFromAPI();
  }

  return Job.find().sort({ createdAt: -1 });
};

module.exports = { fetchJobsFromAPI, ensureJobsLoaded };
