const express = require("express");
const router = express.Router();
const {
  saveResume,
  generateAISuggestions,
  checkMatch,
  getResume
} = require("../controllers/resumeController");

router.post("/save", saveResume);
router.post("/ai-suggestions", generateAISuggestions);
router.post("/check-match", checkMatch);
router.get("/:id", getResume);

module.exports = router;
