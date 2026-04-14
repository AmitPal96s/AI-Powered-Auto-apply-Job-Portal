const Application = require("../models/Application");
const Job = require("../models/job");
const User = require("../models/User");
const { mergeSkills, calculateMatchScore } = require("../services/matchService");
const { getSkillSuggestions } = require("../services/skillSuggestionService");
const {
  detectApplyStrategy,
  executeExternalSubmission,
} = require("../services/applicationExecutors");

const buildAutoApplyReadiness = (user) => {
  const missing = [];

  if (!user?.skills?.length) {
    missing.push("Add at least one skill to your profile");
  }

  if (!user?.preferences?.jobTitle) {
    missing.push("Set a preferred job role");
  }

  if (!user?.preferences?.location) {
    missing.push("Set a preferred location");
  }

  if (!user?.profile?.resumeUrl && !user?.profile?.resumeName) {
    missing.push("Add resume details to your profile");
  }

  return {
    ready: missing.length === 0,
    missing,
  };
};

const createApplicationRecord = async ({
  user,
  job,
  matchScore,
  autoApplied,
}) => {
  if (!job.platform || !job.applyStrategy) {
    const detected = detectApplyStrategy(job.link);
    job.platform = detected.platform;
    job.applyStrategy = detected.applyStrategy;
    job.externalApplySupported = detected.externalApplySupported;
    await job.save();
  }

  const application = await Application.create({
    user: user._id,
    job: job._id,
    jobTitle: job.title,
    company: job.company,
    location: job.location,
    jobLink: job.link,
    matchScore,
    autoApplied,
    status: "Applied",
  });

  const submissionResult = await executeExternalSubmission({
    application,
    job,
    user,
  });

  application.submissionType = submissionResult.submissionType;
  application.submissionStatus = submissionResult.submissionStatus;
  application.submissionAttempts = 1;
  application.notes = submissionResult.notes;

  if (submissionResult.externalSubmissionId) {
    application.externalSubmissionId = submissionResult.externalSubmissionId;
  }

  if (submissionResult.lastSubmissionError) {
    application.lastSubmissionError = submissionResult.lastSubmissionError;
  }

  await application.save();

  return application;
};

// Apply manually to a job
exports.applyToJob = async (req, res, next) => {
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

    const application = await createApplicationRecord({
      user,
      job,
      matchScore,
      autoApplied: false,
    });

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

// Get all applications for a user
exports.getUserApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({
      user: req.user._id,
    }).populate("job");

    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};

// Update application status
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = [
      "Applied",
      "Interview",
      "Rejected",
      "Offer",
      "Shortlisted",
      "Withdrawn",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status",
        allowedStatuses,
      });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only update your own applications",
      });
    }

    application.status = status;
    await application.save();

    res.status(200).json(application);
  } catch (error) {
    next(error);
  }
};

// Auto apply to relevant jobs
exports.autoApplyToJobs = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user?.preferences?.autoApplyEnabled) {
      return res.status(400).json({
        message: "Auto apply is turned off in your profile settings.",
      });
    }

    const readiness = buildAutoApplyReadiness(user);
    if (!readiness.ready) {
      return res.status(400).json({
        message: "Complete your profile before using auto apply.",
        missing: readiness.missing,
      });
    }

    const jobs = await Job.find();

    const suggestedSkills = await getSkillSuggestions(user.skills);
    const combinedSkills = mergeSkills(
      user.skills,
      suggestedSkills
    );

    const appliedJobs = [];
    const skippedJobs = [];
    let eligibleJobs = 0;

    for (const job of jobs) {
      const matchScore = calculateMatchScore(
        combinedSkills,
        job.requiredSkills
      );

      if (matchScore < user.preferences.minMatchScore) {
        skippedJobs.push({
          jobId: job._id,
          title: job.title,
          reason: "match_below_threshold",
          matchScore,
        });
        continue;
      }

      eligibleJobs += 1;

      const existingApplication = await Application.findOne({
        user: user._id,
        job: job._id,
      });

      if (existingApplication) {
        skippedJobs.push({
          jobId: job._id,
          title: job.title,
          reason: "already_applied",
          matchScore,
        });
        continue;
      }

      const application = await createApplicationRecord({
        user,
        job,
        matchScore,
        autoApplied: true,
      });

      appliedJobs.push(application);
    }

    res.status(200).json({
      message: "Auto apply completed",
      totalJobsScanned: jobs.length,
      eligibleJobs,
      totalApplied: appliedJobs.length,
      appliedJobs,
      skippedJobs,
      combinedSkills,
    });
  } catch (error) {
    next(error);
  }
};
