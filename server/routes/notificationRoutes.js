const express = require("express");
const { requireSignIn } = require("../controllers/userController");
const {
  getAllNotificationController,
  dismissNotificationController,
  dismissAllNotificationsController,
} = require("../controllers/notificationController");

const router = express.Router();

// ดึงคำตอบทั้งหมด (ต้องเข้าสู่ระบบ)
router.get(
  "/get-all-notification",
  requireSignIn,
  getAllNotificationController
);
router.post("/:id/dismiss", requireSignIn, dismissNotificationController);
router.post(
  "/notifications/dismiss-all",
  requireSignIn,
  dismissAllNotificationsController
);

module.exports = router;
