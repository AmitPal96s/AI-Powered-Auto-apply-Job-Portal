const express = require("express");
const router = express.Router();
const { getJobs, addJob } = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getJobs);
router.post("/", protect, addJob);

module.exports = router; // ✅ Correct