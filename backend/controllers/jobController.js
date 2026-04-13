const Job = require("../models/job");

// Get all jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a job manually (User-added)
const addJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      source: "User",
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getJobs, addJob };