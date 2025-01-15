const express = require("express");
const { requireSignIn } = require("../controllers/userController");

const {
  snedAnswerController,
  getAllanswerController,
} = require("../controllers/answerController");

const router = express.Router();

router.post("/send-answer", requireSignIn, snedAnswerController);
router.get("/get-all-answer", requireSignIn, getAllanswerController);

module.exports = router;
