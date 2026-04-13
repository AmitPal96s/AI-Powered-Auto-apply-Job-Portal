import axios from "axios";

export const getRecommendedJobs = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    "http://localhost:5000/api/jobs/recommended",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};