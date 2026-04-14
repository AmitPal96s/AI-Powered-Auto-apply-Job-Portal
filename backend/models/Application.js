const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    jobTitle: String,
    company: String,
    location: String,
    jobLink: String,
    matchScore: {
      type: Number,
      default: 0,
    },
    autoApplied: {
      type: Boolean,
      default: false,
    },
    submissionType: {
      type: String,
      enum: [
        "internal_only",
        "manual_redirect",
        "external_api",
        "browser_automation",
      ],
      default: "internal_only",
    },
    submissionStatus: {
      type: String,
      enum: ["pending", "submitted", "manual_required", "failed"],
      default: "pending",
    },
    submissionAttempts: {
      type: Number,
      default: 0,
    },
    lastSubmissionError: String,
    externalSubmissionId: String,
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    notes: String,
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);