const mongoose = require("mongoose");
const feedbackModel = require("../models/feedbackModel");
const MPersonnel = require("../models/mpersonnelModel"); 


// บันทึก Feedback
const saveFeedback = async (req, res) => {
  try {
    const { user_id, doctor_response, feedback_type, evaluation_date, doctor_id } = req.body;

    if (!user_id || !doctor_response || !feedback_type || !evaluation_date || !doctor_id) {
      return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const newFeedback = new feedbackModel({
      user_id,
      doctor_response,
      feedback_type,
      evaluation_date,
      doctor_id,
    });

    await newFeedback.save();
    res.status(201).json({ message: "บันทึก feedback สำเร็จ!", feedback: newFeedback });
  } catch (error) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล", details: error.message });
  }
};

// ดึง Feedback ตาม user_id พร้อมข้อมูลแพทย์
const getAllFeedbacksByUserId = async (req, res) => {
  try {
    const userId = req.query.user_id;

    if (!userId) {
      return res.status(400).json({ message: "กรุณาระบุ user_id", feedbacks: [] });
    }

    const feedbacks = await feedbackModel
      .find({ user_id: userId })
      .populate({
        path: "doctor_id", 
        model: "MPersonnel",
        select: "nametitle name surname",
      })
      .lean();

    // ✅ ถ้าไม่พบข้อมูล ให้ส่ง `200 OK` พร้อม feedbacks: []
    if (!feedbacks || feedbacks.length === 0) {
      return res.status(200).json({ message: "ไม่พบผลการประเมิน", feedbacks: [] });
    }

    res.status(200).json({ message: "ดึงข้อมูลสำเร็จ", feedbacks });
  } catch (error) {
    console.error("Error fetching feedbacks:", error.message);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล", feedbacks: [] });
  }
};



// ดึง Feedback ทั้งหมด พร้อมข้อมูลแพทย์
const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await feedbackModel
      .find()
      .populate({
        path: "doctor_id", 
        select: "nametitle name surname",
      });

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

    const feedbacks = await feedbackModel
      .find({ user_id: id, evaluation_date: date })
      .populate({
        path: "doctor_id", // ✅ ใช้ doctor_id แทน createdBy
        select: "nametitle name surname",
      });

    if (feedbacks.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูล Feedback ในวันนี้" });
    }

    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล", details: error.message });
  }
};

module.exports = { saveFeedback, getAllFeedbacks, getAllFeedbacksByUserId, getFeedbackByDateAndId };
