const Application = require("../models/Application");
const Job = require("../models/job");
const User = require("../models/User");
const { mergeSkills, calculateMatchScore } = require("../services/matchService");
const { getSkillSuggestions } = require("../services/skillSuggestionService");

// Apply manually to a job
exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    const user = await User.findById(req.user._id);
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Prevent duplicate applications
    const existingApplication = await Application.findOne({
      user: user._id,
      job: job._id,
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "Already applied to this job" });
    }

    // Calculate match score
    const suggestedSkills = await getSkillSuggestions(user.skills);
    const combinedSkills = mergeSkills(
      user.skills,
      suggestedSkills
    );
    const matchScore = calculateMatchScore(
      combinedSkills,
      job.requiredSkills
    );

    const application = await Application.create({
      user: user._id,
      job: job._id,
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      jobLink: job.link,
      matchScore,
      autoApplied: false,
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all applications for a user
exports.getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      user: req.user._id,
    }).populate("job");

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Auto apply to relevant jobs
exports.autoApplyToJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const jobs = await Job.find();

    const suggestedSkills = await getSkillSuggestions(user.skills);
    const combinedSkills = mergeSkills(
      user.skills,
      suggestedSkills
    );

    const appliedJobs = [];

    for (const job of jobs) {
      const matchScore = calculateMatchScore(
        combinedSkills,
        job.requiredSkills
      );

      if (
        user.preferences.autoApplyEnabled &&
        matchScore >= user.preferences.minMatchScore
      ) {
        const existingApplication = await Application.findOne({
          user: user._id,
          job: job._id,
        });

        if (!existingApplication) {
          const application = await Application.create({
            user: user._id,
            job: job._id,
            jobTitle: job.title,
            company: job.company,
            location: job.location,
            jobLink: job.link,
            matchScore,
            autoApplied: true,
          });

          appliedJobs.push(application);
        }
      }
    }

    res.status(200).json({
      message: "Auto apply completed",
      appliedJobs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};