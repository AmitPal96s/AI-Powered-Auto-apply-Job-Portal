import apiClient from "../api/apiClient";

// Fetch all jobs
export const getAllJobs = async () => {
  const response = await apiClient.get("/jobs");
  return response.data;
};

// Fetch AI-recommended jobs
export const getRecommendedJobs = async () => {
  const response = await apiClient.get("/jobs/recommended");
  return response.data;
};