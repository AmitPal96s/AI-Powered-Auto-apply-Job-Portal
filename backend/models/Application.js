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
    jobTitle: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    location: String,
    jobLink: String,
    status: {
      type: String,
      enum: ["Saved", "Applied", "Interview", "Offered", "Rejected"],
      default: "Applied",
    },
    matchScore: {
      type: Number,
      default: 0,
    },
    autoApplied: {
      type: Boolean,
      default: false,
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);