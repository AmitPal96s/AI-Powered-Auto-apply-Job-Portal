const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: "Remote" },
    description: String,
    link: { type: String, required: true, unique: true },
    source: {
      type: String,
      enum: ["API", "Company", "User", "Scraped"],
      default: "API",
    },
    platform: {
      type: String,
      default: "Unknown",
    },
    applyStrategy: {
      type: String,
      enum: ["manual_redirect", "api_supported", "browser_required"],
      default: "manual_redirect",
    },
    externalApplySupported: {
      type: Boolean,
      default: false,
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    salary: {
      type: String,
      default: "Not specified",
    },
    postedDate: Date,
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Job || mongoose.model("Job", jobSchema);