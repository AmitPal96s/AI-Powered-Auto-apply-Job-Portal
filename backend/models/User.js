const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    skills: {
      type: [String],
      default: [],
    },
    preferences: {
      jobTitle: { type: String, default: "" },
      location: { type: String, default: "" },
      minMatchScore: { type: Number, default: 70 },
      autoApplyEnabled: { type: Boolean, default: false },
    },
    profile: {
      avatarUrl: { type: String, default: "" },
      headline: { type: String, default: "" },
      bio: { type: String, default: "" },
      phone: { type: String, default: "" },
      institute: { type: String, default: "" },
      degree: { type: String, default: "" },
      graduationYear: { type: String, default: "" },
      experience: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      portfolio: { type: String, default: "" },
      resumeUrl: { type: String, default: "" },
      resumeName: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

// 🔹 Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 🔹 Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// 🔹 Prevent OverwriteModelError
module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);
