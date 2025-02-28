const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
    {
        user_id: { type: String, required: true },
        doctor_response: { type: String, required: true },
        feedback_type: { type: String, enum: ["ทำได้ดี", "ควรปรับปรุง"], required: true },
        evaluation_date: { type: Date, required: true },  // เปลี่ยนจาก String -> Date
    },
    { versionKey: false, collection: "feedback", timestamps: true }
);


module.exports = mongoose.model("feedback", feedbackSchema);

