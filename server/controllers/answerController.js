const mongoose = require("mongoose");
const answerModel = require("../models/answerModel");

// ส่งคำตอบและบันทึกลงฐานข้อมูล
const sendAnswerController = async (req, res) => {
  try {
    const { userId, answers } = req.body;

    if (!userId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Please provide userId and answers array",
      });
    }

    // ตรวจสอบว่าผู้ใช้เคยตอบแบบสอบถามแล้วหรือยัง
    const existingAnswer = await answerModel.findOne({ userId });

    if (existingAnswer) {
      return res.status(400).json({
        success: false,
        message: "User has already completed the survey",
      });
    }

    const newAnswer = await answerModel.create({ userId, answers });

    res.status(201).json({
      success: true,
      message: "Answer submitted successfully",
      answer: newAnswer,
    });
  } catch (error) {
    console.error("Error in submit answer:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

// ดึงคำตอบทั้งหมด
const getAllAnswersController = async (req, res) => {
  try {
    const answers = await answerModel.find().populate("userId", "name email");

    res.status(200).json({
      success: true,
      message: "All answers retrieved successfully",
      answers,
    });
  } catch (error) {
    console.error("Error in fetching answers:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

// ตรวจสอบว่าผู้ใช้เคยตอบแบบสอบถามหรือยัง
const checkUserSurveyStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const existingAnswer = await answerModel.findOne({ userId });

    res.status(200).json({
      success: true,
      isSurveyCompleted: !!existingAnswer, // คืนค่า boolean ที่ถูกต้อง
    });
  } catch (error) {
    console.error("Error in checking survey status:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};


module.exports = {
  sendAnswerController,
  getAllAnswersController,
  checkUserSurveyStatus,
};
