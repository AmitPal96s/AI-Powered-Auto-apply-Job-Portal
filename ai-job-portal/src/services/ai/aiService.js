import apiClient from "../api/apiClient";

const normalizeSkills = (skills = []) =>
  [...new Set(skills.map((skill) => `${skill}`.trim()).filter(Boolean))];

const buildFallbackSuggestions = (skills = [], profile = {}) => {
  const cleanSkills = normalizeSkills(skills);
  const targetRole = profile.jobTitle || profile.preferredRole || "";
  const suggestions = [];

  if (targetRole) {
    suggestions.push(`Tune your headline for ${targetRole}.`);
  }

  if (cleanSkills.length) {
    suggestions.push(
      `Highlight ${cleanSkills.slice(0, 3).join(", ")} in your resume and projects.`
    );
  } else {
    suggestions.push("Add your main skills so I can personalize your roadmap.");
  }

  suggestions.push("Add one quantified project bullet to improve recruiter trust.");
  suggestions.push("Keep your LinkedIn and portfolio links current.");

  return suggestions;
};

const buildFallbackReply = (messages = []) => {
  const latest =
    [...messages]
      .reverse()
      .find((message) => typeof message?.content === "string" && message.content.trim()) ||
    {};
  const prompt = `${latest.content || ""}`.toLowerCase();

  if (prompt.includes("resume")) {
    return "Tailor your resume to the role, keep the summary short, and add measurable project results.";
  }

  if (prompt.includes("interview")) {
    return "Practice project stories, behavioral questions, and a short pitch for why you fit the role.";
  }

  if (prompt.includes("skill") || prompt.includes("learn")) {
    return "Focus on one core skill, one tooling skill, and one project-based proof point each week.";
  }

  return "I can help with skill gaps, resume feedback, interview prep, and job matching. Ask me anything career-related.";
};

export const sendMessage = async (messages) => {
  try {
    const response = await apiClient.post("/ai/chat", { messages });
    return response.data.reply;
  } catch (error) {
    console.error("AI Chat Error:", error);
    return buildFallbackReply(messages);
  }
};

export const getSuggestions = async (skills, profile) => {
  try {
    const response = await apiClient.post("/ai/suggestions", {
      skills,
      profile,
    });
    return response.data.suggestions;
  } catch (error) {
    console.error("AI Suggestions Error:", error);
    return buildFallbackSuggestions(skills, profile);
  }
};

export const getSkillGap = async (userSkills, jobSkills) => {
  try {
    const response = await apiClient.post("/ai/skill-gap", {
      userSkills,
      jobSkills,
    });
    return response.data.missingSkills;
  } catch (error) {
    console.warn("Backend unavailable, using fallback skill gap.");
    const userSet = normalizeSkills(userSkills).map((skill) =>
      skill.toLowerCase()
    );
    return normalizeSkills(jobSkills).filter(
      (skill) => !userSet.includes(skill.toLowerCase())
    );
  }
};

export const getRejectionFeedback = async (
  jobTitle,
  company,
  userSkills
) => {
  try {
    const response = await apiClient.post("/ai/rejection-feedback", {
      jobTitle,
      company,
      userSkills,
    });
    return response.data.feedback;
  } catch (error) {
    console.warn("Backend unavailable, using fallback rejection feedback.");
    const focusSkill = normalizeSkills(userSkills)[0] || "portfolio depth";
    return `Although you were not selected for the ${jobTitle} role at ${company}, you are on the right track. Strengthen ${focusSkill}, add a measurable project result, and tailor your summary to the role requirements.`;
  }
};

const aiService = {
  sendMessage,
  getSuggestions,
  getSkillGap,
  getRejectionFeedback,
};

export default aiService;
