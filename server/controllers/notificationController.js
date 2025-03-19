const mongoose = require("mongoose");
const NotificationModel = require("../models/notificationModel");

// Get All Posts
const getAllNotificationController = async (req, res) => {
  console.log("user", req);

  const userId = req.auth._id;

  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const notifications = await NotificationModel.find({
      dismissedBy: { $ne: userId },
      isDeleted: false, // กรองแจ้งเตือนที่ถูกลบออกไปแล้ว (ถ้ามีการใช้งาน)
      notifyDate: { $lte: today },
    }).sort({ notifyDate: -1 });

    res.status(200).send({
      success: true,
      message: "All notifications retrieved successfully",
      notifications,
    });
  } catch (error) {
    console.error("Error in get all notifications:", error);
    res.status(500).send({
      success: false,
      message: "Error in get all notifications API",
      error,
    });
  }
};

const dismissNotificationController = async (req, res) => {
  const notificationId = req.params.id;
  console.log("notificationId", notificationId);
  const userId = req.auth._id; // จาก middleware ที่ตรวจสอบ auth แล้ว

  try {
    // เพิ่ม userId เข้าไปใน dismissedBy (ถ้ายังไม่มีใน array)
    await NotificationModel.findByIdAndUpdate(
      notificationId,
      { $addToSet: { dismissedBy: userId } },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Dismissed notification successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const dismissAllNotificationsController = async (req, res) => {
  const userId = req.auth._id; // จาก middleware ตรวจสอบ auth แล้ว

  try {
    // อัปเดตทุก notification ที่ userId ยังไม่ dismiss
    await NotificationModel.updateMany(
      { dismissedBy: { $ne: userId } }, // กรองเฉพาะแจ้งเตือนที่ user ยังไม่ได้ dismiss
      { $addToSet: { dismissedBy: userId } } // เพิ่ม userId ใน dismissedBy
    );

    res.status(200).send({
      success: true,
      message: "Dismissed all notifications successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllNotificationController,
  dismissNotificationController,
  dismissAllNotificationsController,
};
