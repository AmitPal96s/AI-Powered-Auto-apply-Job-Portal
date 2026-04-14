import apiClient from "../api/apiClient";

// 🔹 Login User
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Login failed");
    } else if (error.request) {
      throw new Error("Cannot connect to the server. Please try again.");
    } else {
      throw new Error(error.message);
    }
  }
};

// 🔹 Register User
export const registerUser = async (payload) => {
  try {
    const response = await apiClient.post("/auth/register", payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Registration failed"
      );
    } else if (error.request) {
      throw new Error("Cannot connect to the server. Please try again.");
    } else {
      throw new Error(error.message);
    }
  }
};

// 🔹 Get Logged-in User Profile
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get("/auth/profile");
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to load profile"
      );
    } else if (error.request) {
      throw new Error("Cannot connect to the server. Please try again.");
    } else {
      throw new Error(error.message);
    }
  }
};

// 🔹 Update Logged-in User Profile
export const updateUserProfile = async (payload) => {
  try {
    const response = await apiClient.put("/auth/profile", payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to update profile"
      );
    } else if (error.request) {
      throw new Error("Cannot connect to the server. Please try again.");
    } else {
      throw new Error(error.message);
    }
  }
};