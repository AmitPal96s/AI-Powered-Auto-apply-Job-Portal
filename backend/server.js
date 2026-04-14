const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const aiRoutes = require("./routes/aiRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/jobs", recommendationRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/ai", aiRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});