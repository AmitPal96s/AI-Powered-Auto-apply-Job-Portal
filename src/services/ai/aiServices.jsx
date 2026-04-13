// src/services/Ai/aiService.js
import axios from "axios";

// Base URL for backend API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Attach JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// 1. Chatbot Interaction

export const sendMessage = async (messages) => {
  try {
    const response = await apiClient.post("/ai/chat", { messages });
    return response.data.reply;
  } catch (error) {
    console.error("AI Chat Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to get AI response."
    );
  }
};


// 2. General AI Suggestions

export const getSuggestions = async (skills, profile) => {
  try {
    const response = await apiClient.post("/ai/suggestions", {
      skills,
      profile,
    });
    return response.data.suggestions;
  } catch (error) {
    console.error("AI Suggestions Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch AI suggestions."
    );
  }
};


//3. Skill Gap Analysis

export const getSkillGap = async (userSkills, jobSkills) => {
  const useMock = import.meta.env.VITE_USE_MOCK === "true";

  const mockSkillGap = () => {
    const missing = jobSkills.filter(
      (skill) =>
        !userSkills.some(
          (userSkill) =>
            userSkill.toLowerCase() === skill.toLowerCase()
        )
    );

    return new Promise((resolve) => {
      setTimeout(() => resolve(missing), 800);
    });
  };

  if (useMock) {
    return await mockSkillGap();
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/ai/skill-gap`, {
      userSkills,
      jobSkills,
    });
    return response.data.missingSkills;
  } catch (error) {
    console.warn("Backend unavailable, using mock skill gap.");
    return await mockSkillGap();
  }
};


//  4. Rejection Feedback

export const getRejectionFeedback = async (
  jobTitle,
  company,
  userSkills
) => {
  const useMock = import.meta.env.VITE_USE_MOCK === "true";

  const mockFeedback = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          `Although you were not selected for the ${jobTitle} role at ${company}, you are on the right track. Consider strengthening your skills in areas such as ${
            userSkills.includes("TypeScript")
              ? "system design and advanced frontend optimization"
              : "TypeScript and modern frontend tooling"
          }. Enhancing your portfolio and preparing for behavioral interviews can also improve your chances in future applications.`
        );
      }, 1000);
    });
  };

  if (useMock) {
    return await mockFeedback();
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/ai/rejection-feedback`,
      {
        jobTitle,
        company,
        userSkills,
      }
    );
    return response.data.feedback;
  } catch (error) {
    console.warn("Backend unavailable, using mock rejection feedback.");
    return await mockFeedback();
  }
};

// ===============================
// 📤 Export as a grouped service
// ===============================
const aiService = {
  sendMessage,
  getSuggestions,
  getSkillGap,
  getRejectionFeedback,
};

export default aiService;