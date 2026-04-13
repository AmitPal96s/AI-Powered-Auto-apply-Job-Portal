// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const { fetchJobsFromAPI } = require("./services/jobAggregator");
const cron = require("node-cron");
const recommendationRoutes = require("./routes/recommendationRoutes");
const applicationRoutes = require("./routes/applicationRoutes");



// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/jobs", recommendationRoutes);
app.use("/api/applications", applicationRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.send("JobGenie API is running...");
});


// Schedule job fetching every hour
cron.schedule("0 * * * *", async () => {
  console.log("🔄 Fetching new job listings...");
  await fetchJobsFromAPI();
});

// Define Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});