const express = require("express");
const { requireSignIn } = require("../controllers/userController");

const { checkDailyLimit } = require("../helpers/checkDailyLimitHelper");

const {
  createMissionController,
  getAllMissionController,
  createSubMissionController,
  updateSubmissionController,
  getSubmissionDataController,
  snedEvaluateController,
} = require("../controllers/missionController");

const router = express.Router();

router.post("/create-mission", requireSignIn, createMissionController);
router.get("/get-all-mission", requireSignIn, getAllMissionController);
router.post("/create-sub-mission", requireSignIn, createSubMissionController);
router.put("/:id/submission", requireSignIn, updateSubmissionController);
router.get("/get-mission/:id", requireSignIn, getSubmissionDataController);
router.post(
  "/:id/evaluate",
  requireSignIn,
  checkDailyLimit,
  snedEvaluateController
);

module.exports = router;
