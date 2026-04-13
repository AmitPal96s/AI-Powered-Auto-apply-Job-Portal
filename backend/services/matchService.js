// backend/services/matchService.js

// Merge user skills with suggested skills
const mergeSkills = (userSkills = [], suggestedSkills = []) => {
  const skillSet = new Set(
    [...userSkills, ...suggestedSkills].map((skill) =>
      skill.toLowerCase().trim()
    )
  );
  return Array.from(skillSet);
};

// Calculate match score between user skills and job skills
const calculateMatchScore = (combinedSkills = [], jobSkills = []) => {
  if (!combinedSkills.length || !jobSkills.length) return 0;

  const normalizedJobSkills = jobSkills.map((skill) =>
    skill.toLowerCase().trim()
  );

  const matches = normalizedJobSkills.filter((skill) =>
    combinedSkills.includes(skill)
  );

  return Math.round((matches.length / normalizedJobSkills.length) * 100);
};

module.exports = { mergeSkills, calculateMatchScore };