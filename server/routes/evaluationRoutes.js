const express = require("express");
const { requireSignIn } = require("../controllers/userController");
const { getEvaluationController } = require("../controllers/evaluationController");

const router = express.Router();

router.post("/", requireSignIn, getEvaluationController);

module.exports = router;
