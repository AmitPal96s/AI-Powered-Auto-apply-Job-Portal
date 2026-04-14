const express = require("express");
const router = express.Router();

const {
  chat,
  getSuggestions,
  getSkillGap,
  getRejectionFeedback,
} = require("../controllers/aiController");

const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/chat", chat);
router.post("/suggestions", getSuggestions);
router.post("/skill-gap", getSkillGap);
router.post("/rejection-feedback", getRejectionFeedback);

module.exports = router;