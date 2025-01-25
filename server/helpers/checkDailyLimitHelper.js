const mongoose = require("mongoose");
const EvaluateModel = require("../models/evaluateModel");

const checkDailyLimit = async (req, res, next) => {
  const { _id } = req.auth; // ใช้ userId จากการ authenticate

  // คำนวณช่วงเวลาวันนี้ (ตั้งแต่ 00:00 จนถึง 23:59)
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0); // ตั้งเวลาเป็น 00:00
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999); // ตั้งเวลาเป็น 23:59

  try {
    // ค้นหาประเมินที่ตรงกับ userId และอยู่ในช่วงเวลาของวันนี้
    const existingEvaluate = await EvaluateModel.findOne({
      userId: _id,
      created_at: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingEvaluate) {
      // หากพบว่า user มีการ evaluate แล้วในวันนี้
      return res
        .status(400)
        .send({ message: "คุณสามารถทำการประเมินได้เพียงครั้งเดียวต่อวัน" });
    }

    // หากยังไม่มีการ evaluate ในวันนี้ อนุญาตให้เรียก API ต่อ
    next();
  } catch (err) {
    console.error("Error in checking daily limit:", err);
    return res.status(500).send({ message: "Server error" });
  }
};

module.exports = { checkDailyLimit };
