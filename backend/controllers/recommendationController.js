const User = require("../models/User");
const Job = require("../models/job");
const { getSkillSuggestions } = require("../services/skillSuggestionService");

// Normalize skills
const normalizeSkills = (skills = []) =>
  [...new Set(skills.map(s => s.toLowerCase().trim()).filter(Boolean))];

// Merge user + suggested skills
const mergeSkills = (userSkills = [], suggestedSkills = []) => {
  return normalizeSkills([...userSkills, ...suggestedSkills]);
};

// 🔥 Match calculation (IMPORTANT)
const calculateMatch = (userSkills, jobSkills = []) => {
  const userSet = new Set(userSkills);

  const matchedSkills = jobSkills.filter(skill =>
    userSet.has(skill.toLowerCase())
  );

  const missingSkills = jobSkills.filter(
    skill => !userSet.has(skill.toLowerCase())
  );

  const matchScore = jobSkills.length
    ? Math.round((matchedSkills.length / jobSkills.length) * 100)
    : 0;

  return {
    matchScore,
    matchedSkills,
    missingSkills,
  };
};

// ✅ MAIN CONTROLLER
exports.getRecommendedJobs = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const userSkills = normalizeSkills(user.skills || []);

    // AI suggested skills
    const suggestedSkills = normalizeSkills(
      await getSkillSuggestions(userSkills)
    );

    const combinedSkills = mergeSkills(userSkills, suggestedSkills);

    // Fetch jobs
    const jobs = await Job.find();

    // 🔥 Build enriched jobs
    const recommendedJobs = jobs.map((job) => {
      const jobSkills = normalizeSkills(job.requiredSkills || []);

      const { matchScore, matchedSkills, missingSkills } =
        calculateMatch(combinedSkills, jobSkills);

      const explanation = `You match ${matchedSkills.length}/${jobSkills.length} skills. Improve ${missingSkills.slice(0, 2).join(", ") || "your profile"} to increase chances.`;

      return {
        ...job.toObject(),
        matchScore,
        matchedSkills,
        missingSkills,
        explanation,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      combinedSkills,
      suggestedSkills,
      recommendedJobs,
      matchSummary: {
        minMatchScore: user.preferences?.minMatchScore || 70,
        totalRecommended: recommendedJobs.length,
      },
    });

  } catch (error) {
    next(error);
  }
};