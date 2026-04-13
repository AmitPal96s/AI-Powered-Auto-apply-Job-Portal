const Job = require("../models/job");
const User = require("../models/User");
const { mergeSkills, calculateMatchScore } = require("../services/matchService");
const { getSkillSuggestions } = require("../services/skillSuggestionService");

// @desc    Get recommended jobs for a user
// @route   GET /api/jobs/recommended
// @access  Private
exports.getRecommendedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Get suggested skills based on market demand
    const suggestedSkills = await getSkillSuggestions(user.skills);

    // Merge user and suggested skills
    const combinedSkills = mergeSkills(
      user.skills,
      suggestedSkills
    );

    // Fetch all jobs
    const jobs = await Job.find();

    // Calculate match score for each job
    const recommendedJobs = jobs
      .map((job) => {
        const matchScore = calculateMatchScore(
          combinedSkills,
          job.requiredSkills
        );

        return {
          ...job.toObject(),
          matchScore,
        };
      })
      .filter(
        (job) => job.matchScore >= user.preferences.minMatchScore
      )
      .sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      combinedSkills,
      recommendedJobs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};