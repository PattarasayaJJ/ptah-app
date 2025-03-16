const { StatusCodes } = require("http-status-codes");
const Evaluate = require("../models/evaluateModel.js");
const feedbackModel = require("../models/feedbackModel.js");
const mongoose = require("mongoose");

const getDataCalendar = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "User ID is required" });
        }

        // ✅ ตรวจสอบว่า `id` เป็น `ObjectId` ที่ถูกต้อง
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid User ID" });
        }

        console.log(`🛠️ Fetching calendar data for user ID: ${id}`);

        // ✅ ดึงข้อมูลจากฐานข้อมูล
        const evaluations = await Evaluate.find({ userId: id }).lean();
        const feedbacks = await feedbackModel.find({ user_id: id }).lean();

        // ✅ ถ้าไม่มีข้อมูล ให้ส่งกลับ `[]` แทน `404`
        if (!evaluations.length && !feedbacks.length) {
            console.log("⚠️ No data found, returning empty array.");
            return res.status(StatusCodes.OK).json([]); // ✅ ส่ง `200 OK` พร้อมข้อมูลว่าง
        }

        // ✅ จัดรูปแบบข้อมูลสำหรับ Calendar
        const calendarMap = {};
        const dateCount = {};

        // ✅ เพิ่มข้อมูลจาก Evaluations
        evaluations.forEach((evalData) => {
            const dateKey = evalData.created_at.toISOString().split("T")[0];

            if (!calendarMap[dateKey]) {
                calendarMap[dateKey] = { created_at: evalData.created_at, star: false, feedback_date: null, feedback_status: "notsent" };
            }

            dateCount[dateKey] = (dateCount[dateKey] || 0) + 1;
        });

        // ✅ ถ้าวันใดมี 4 รายการ ให้กำหนด `feedback_date = ""` และให้ดาว ⭐
        Object.keys(dateCount).forEach((dateKey) => {
            if (dateCount[dateKey] === 4 && !calendarMap[dateKey].feedback_date) {
                calendarMap[dateKey].feedback_date = "";
                calendarMap[dateKey].star = true; // ⭐ ได้รับดาว
            }
        });

        // ✅ เพิ่มข้อมูลจาก Feedbacks (แก้ปัญหา `evaluation_date.toISOString()`)
        feedbacks.forEach((fb) => {
            let dateKey = fb.evaluation_date;

            // ✅ ตรวจสอบว่าเป็น Date หรือไม่
            if (dateKey instanceof Date) {
                dateKey = dateKey.toISOString().split("T")[0]; // แปลงเป็น YYYY-MM-DD
            } else if (typeof dateKey === "string") {
                dateKey = dateKey.split("T")[0]; // แปลง String เป็น YYYY-MM-DD
            } else {
                console.warn("⚠️ Invalid evaluation_date:", fb.evaluation_date);
                return; // ข้ามรายการที่ไม่มีวันที่
            }

            // ✅ ถ้ายังไม่มีให้สร้างใหม่
            if (!calendarMap[dateKey]) {
                calendarMap[dateKey] = { created_at: null, star: false, feedback_date: dateKey, feedback_status: "notsent" };
            }

            // ✅ ถ้าวันนี้มี 4 รายการ → แสดง ⭐
            if (dateCount[dateKey] === 4) {
                calendarMap[dateKey].star = true;
            }

            // ✅ แปลง `feedback_type` เป็น `feedback_status`
            switch (fb.feedback_type) {
                case "ทำได้ดี":
                    calendarMap[dateKey].feedback_status = 0;
                    break;
                case "ควรปรับปรุง":
                    calendarMap[dateKey].feedback_status = 1;
                    break;
            }
        });

        // ✅ แปลงข้อมูลเป็น Array ที่พร้อมใช้งานใน React Native
        const calendarData = Object.keys(calendarMap).map(dateKey => ({
            date: dateKey,
            status: calendarMap[dateKey].feedback_status,
            star: calendarMap[dateKey].star || false
        }));

        console.log("✅ Final Calendar Data for User:", id, calendarData);
        res.status(StatusCodes.OK).json(calendarData);
    } catch (error) {
        console.error("❌ Error fetching calendar data:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
};

module.exports = { getDataCalendar };
