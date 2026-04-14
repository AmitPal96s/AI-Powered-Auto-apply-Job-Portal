const Job = require("../models/job");
const { ensureJobsLoaded } = require("../services/jobAggregator");

// Get all jobs
const getJobs = async (req, res, next) => {
  try {
    const jobs = await ensureJobsLoaded();
    res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
};

// Add a job manually (User-added)
const addJob = async (req, res, next) => {
  try {
    const job = await Job.create({
      ...req.body,
      source: "User",
    });
    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

module.exports = { getJobs, addJob };
