const express = require("express");
const router = express.Router();
const {
  applyToJob,
  getUserApplications,
  updateApplicationStatus,
  autoApplyToJobs,
} = require("../controllers/applicationController");
const { protect } = require("../middleware/authMiddleware");

router.post("/apply", protect, applyToJob);
router.get("/", protect, getUserApplications);
router.put("/:id/status", protect, updateApplicationStatus);
router.post("/auto-apply", protect, autoApplyToJobs);

module.exports = router;
