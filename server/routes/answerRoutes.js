const express = require("express");
const { requireSignIn } = require("../controllers/userController");
const {
  sendAnswerController,
  getAllAnswersController,
  checkUserSurveyStatus,
} = require("../controllers/answerController");

const router = express.Router();

// ส่งคำตอบ (ต้องเข้าสู่ระบบ)
router.post("/send-answer", requireSignIn, sendAnswerController);

// ดึงคำตอบทั้งหมด (ต้องเข้าสู่ระบบ)
router.get("/get-all-answers", requireSignIn, getAllAnswersController);

// ตรวจสอบว่าผู้ใช้เคยทำแบบสอบถามหรือยัง
router.get("/user/:userId/survey-status", requireSignIn, checkUserSurveyStatus);

module.exports = router;
