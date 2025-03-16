const express = require("express");
const { getDataCalendar } = require("../controllers/MainController.js");

const router = express.Router();

// ✅ ต้องใช้ `router.get()` แทน `.route().get()`
router.get("/datacalendar/:id", getDataCalendar);

module.exports = router;
