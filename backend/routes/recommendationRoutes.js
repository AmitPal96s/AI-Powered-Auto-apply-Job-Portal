const express = require("express");
const router = express.Router();
const { getRecommendedJobs } = require("../controllers/recommendationController");
const { protect } = require("../middleware/authMiddleware");

router.get("/recommended", protect, getRecommendedJobs);

module.exports = router;