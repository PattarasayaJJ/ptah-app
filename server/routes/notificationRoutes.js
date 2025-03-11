const express = require("express");
const { requireSignIn } = require("../controllers/userController");
const {
  getAllNotificationController,
} = require("../controllers/notificationController");

const router = express.Router();

// ดึงคำตอบทั้งหมด (ต้องเข้าสู่ระบบ)
router.get(
  "/get-all-notification",
  requireSignIn,
  getAllNotificationController
);

module.exports = router;
