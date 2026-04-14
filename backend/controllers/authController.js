const User = require("../models/User");
const jwt = require("jsonwebtoken");

// 🔹 Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// 🔹 Standardized response structure
const buildAuthUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  skills: user.skills || [],
  preferences: user.preferences || {},
  profile: user.profile || {},
  token: generateToken(user._id),
});

// 🔹 Register User
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    res.status(201).json(buildAuthUserResponse(user));
  } catch (error) {
    next(error);
  }
};

// 🔹 Login User
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Sorry, user not found. Register first." });
    }

    if (!(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json(buildAuthUserResponse(user));
  } catch (error) {
    next(error);
  }
};

// 🔹 Get User Profile
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ message: "Sorry, user not found. Register first." });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// 🔹 Update User Profile
exports.updateUserProfile = async (req, res, next) => {
  try {
    const { name, skills, preferences, profile } = req.body;
    const update = {};

    if (typeof name === "string" && name.trim()) {
      update.name = name.trim();
    }

    if (Array.isArray(skills)) {
      update.skills = skills.map((skill) => `${skill}`.trim()).filter(Boolean);
    }

    if (preferences && typeof preferences === "object") {
      update.preferences = preferences;
    }

    if (profile && typeof profile === "object") {
      update.profile = profile;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: update },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ message: "Sorry, user not found. Register first." });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      skills: user.skills,
      preferences: user.preferences,
      profile: user.profile,
    });
  } catch (error) {
    next(error);
  }
};
