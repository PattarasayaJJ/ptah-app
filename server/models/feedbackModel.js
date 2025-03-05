const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    doctor_response: { type: String, required: true },
    feedback_type: { type: String, enum: ["ทำได้ดี", "ควรปรับปรุง"], required: true },
    evaluation_date: { type: Date, required: true }, // ใช้ Date แทน String
    doctor_id: { type: mongoose.Types.ObjectId, ref: "MPersonnel", required: true }, // ✅ อ้างอิง Doctor
  },
  { versionKey: false, collection: "feedback", timestamps: true }
);

module.exports = mongoose.model("feedback", feedbackSchema);
