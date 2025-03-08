const mongoose = require("mongoose");
const EvaluateModel = require("../models/evaluateModel");

const getEvaluationController = async (req, res) => {
    try {
        console.log("📥 Received Request:", req.body);

        const { user_id, date } = req.body;
        if (!user_id || !date) {
            return res.status(400).send({ success: false, message: "Missing fields" });
        }

        // แปลง `date` ให้เป็น ISO Format และรองรับโซนเวลาไทย (UTC+7)
        const startDate = new Date(date);
        startDate.setHours(0 + 7, 0, 0, 0);  // ปรับเป็นเวลา 00:00:00 UTC+7
        const endDate = new Date(date);
        endDate.setHours(23 + 7, 59, 59, 999); // ปรับเป็นเวลา 23:59:59 UTC+7

        console.log("📅 Checking range:", {
            start: startDate.toISOString(),
            end: endDate.toISOString(),
        });

        // ตรวจสอบว่าค่า `user_id` เป็น `ObjectId` หรือไม่
        const userIdQuery = mongoose.Types.ObjectId.isValid(user_id) ? new mongoose.Types.ObjectId(user_id) : user_id;

        // ค้นหาข้อมูลทั้งหมดที่ตรงกับ `user_id` และ `created_at` ในวันนั้น
        const evaluations = await EvaluateModel.find({
            userId: userIdQuery,
            created_at: { $gte: startDate, $lt: endDate },
        });

        if (!evaluations.length) {
            return res.status(404).send({ success: false, message: "ไม่พบการะประเมินในวันนี้จากผู้ป่วย" });
        }

        res.status(200).send(evaluations); // ✅ ส่งกลับข้อมูลทั้งหมดเป็น array
    } catch (error) {
        console.error("🚨 Error fetching evaluations:", error);
        res.status(500).send({ success: false, message: "Server error", error });
    }
};

module.exports = { getEvaluationController };
