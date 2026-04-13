const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: "Remote",
    },
    description: {
      type: String,
    },
    link: {
      type: String,
      required: true,
      unique: true, // Prevent duplicate jobs
    },
    source: {
      type: String,
      enum: ["API", "Company", "User", "Scraped"],
      default: "API",
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    salary: {
      type: String,
    },
    postedDate: {
      type: Date,
    },
   employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Remote"],
    },
    experienceLevel: {
      type: String,
      enum: ["Entry", "Mid", "Senior", "Lead"],
    },
    tags: {
      type: [String],
      default: [],
    },
  
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Job || mongoose.model("Job", jobSchema);