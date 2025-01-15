const express = require("express");
const { requireSignIn } = require("../controllers/userController");

const {
  createQuestionController,
  getAllQuestionController,
  getQuestionByIdController,
} = require("../controllers/questionController");

const router = express.Router();

router.post("/create-question", requireSignIn, createQuestionController);
router.get("/get-all-questions", requireSignIn, getAllQuestionController);
router.get("/get-question/:id", requireSignIn, getQuestionByIdController);

module.exports = router;
