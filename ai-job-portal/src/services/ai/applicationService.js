import apiClient from "../api/apiClient";

// Apply to a specific job
export const applyToJob = async (jobId) => {
  try {
    const response = await apiClient.post("/applications/apply", { jobId });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to apply to job."
    );
  }
};

// Get all applications of the logged-in user
export const getUserApplications = async () => {
  try {
    const response = await apiClient.get("/applications");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch user applications."
    );
  }
};

// Automatically apply to matching jobs
export const autoApplyToJobs = async () => {
  try {
    const response = await apiClient.post("/applications/auto-apply");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to auto apply to jobs."
    );
  }
};