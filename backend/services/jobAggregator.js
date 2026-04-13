const axios = require("axios");
const Job = require("../models/job");

// Simple skill extraction from job description
const extractSkills = (description) => {
  const skills = [
    "React",
    "Node.js",
    "MongoDB",
    "Express",
    "TypeScript",
    "Python",
    "AWS",
    "Docker",
  ];

  return skills.filter((skill) =>
    description?.toLowerCase().includes(skill.toLowerCase())
  );
};

// Fetch jobs from Remotive API
const fetchJobsFromAPI = async () => {
  try {
    const response = await axios.get(
      process.env.REMOTIVE_API_URL || "https://remotive.com/api/remote-jobs"
    );

    const jobs = response.data.jobs.map((job) => ({
      title: job.title,
      company: job.company_name,
      location: job.candidate_required_location,
      description: job.description,
      link: job.url,
      source: "API",
      requiredSkills: extractSkills(job.description),
      salary: job.salary || "Not specified",
      postedDate: new Date(job.publication_date),
    }));

    // Insert or update jobs to avoid duplicates
    for (const job of jobs) {
      await Job.updateOne({ link: job.link }, job, { upsert: true });
    }

    console.log(`✅ ${jobs.length} jobs fetched and stored`);
  } catch (error) {
    console.error("Error fetching jobs:", error.message);
  }
};

module.exports = { fetchJobsFromAPI };