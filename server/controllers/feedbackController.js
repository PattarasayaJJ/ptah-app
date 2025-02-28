const mongoose = require('mongoose');

const feedbackModel = require("../models/feedbackModel");

// บันทึก Feedback
const saveFeedback = async (req, res) => {
  try {
    const { user_id, doctor_response, feedback_type, evaluation_date } = req.body;

    if (!user_id || !doctor_response || !feedback_type || !evaluation_date) {
      return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const newFeedback = new feedbackModel({
      user_id,
      doctor_response,
      feedback_type,
      evaluation_date,
    });

    await newFeedback.save();
    res.status(201).json({ message: "บันทึก feedback สำเร็จ!", feedback: newFeedback });
  } catch (error) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล", details: error.message });
  }
};

// ดึง Feedback ตาม user_id
const getAllFeedbacksByUserId = async (req, res) => {
  try {
    const userId = req.query.user_id;

    if (!userId) {
      return res.status(400).json({ error: "กรุณาระบุ user_id" });
    }

    const feedbacks = await feedbackModel.find({ user_id: userId });

    if (!feedbacks.length) {
      return res.status(404).json({ message: "ไม่พบ Feedback ของผู้ใช้ในระบบ" });
    }

    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error.message);
    res.status(500).json({ message: "Failed to fetch feedbacks", error });
  }
};

// ดึง Feedback ทั้งหมด
const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await feedbackModel.find();

    if (!feedbacks.length) {
      return res.status(404).json({ message: "ไม่พบ Feedback ใดๆ ในฐานข้อมูล" });
    }

    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error.message);
    res.status(500).json({ message: "Failed to fetch feedbacks", error });
  }
};

// ดึง Feedback ตาม ID และวันที่
const getFeedbackByDateAndId = async (req, res) => {
  try {
    const { id, date } = req.body;

    if (!id || !date) {
      return res.status(400).json({ error: "กรุณาระบุ ID และวันที่" });
    }

    const feedbacks = await feedbackModel.find({ user_id: id, evaluation_date: date });

    if (feedbacks.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูล Feedback ในวันนี้" });
    }

    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล", details: error.message });
  }
};

module.exports = { saveFeedback, getAllFeedbacks, getAllFeedbacksByUserId, getFeedbackByDateAndId };

