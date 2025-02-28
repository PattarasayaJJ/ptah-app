const express = require("express");
const { saveFeedback, getFeedbackByDateAndId, getAllFeedbacks, getAllFeedbacksByUserId } = require("../controllers/feedbackController");

const router = express.Router();

// Routes
router.post("/", saveFeedback);
router.get("/", getAllFeedbacks);
router.get("/user", getAllFeedbacksByUserId);
router.post("/by-date-and-id", getFeedbackByDateAndId);

module.exports = router;
