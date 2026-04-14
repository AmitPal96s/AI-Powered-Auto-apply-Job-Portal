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
const dbConnectionPromise = connectDB();
dbConnectionPromise.catch((error) => {
  console.error(`Initial MongoDB connection failed: ${error.message}`);
});

const app = express();

app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/jobs", recommendationRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/ai", aiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
