const Job = require("../models/job");

const getSkillSuggestions = async (userSkills = []) => {
  const jobs = await Job.find().select("requiredSkills");

  const frequency = {};
  const normalizedUserSkills = userSkills.map((s) => s.toLowerCase());

  jobs.forEach((job) => {
    job.requiredSkills.forEach((skill) => {
      const normalizedSkill = skill.toLowerCase();
      if (!normalizedUserSkills.includes(normalizedSkill)) {
        frequency[normalizedSkill] =
          (frequency[normalizedSkill] || 0) + 1;
      }
    });
  });

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([skill]) => skill);
};

module.exports = { getSkillSuggestions };