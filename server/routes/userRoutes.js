const express = require("express");
const {
  signupController,
  signinController,
  updateUserController,
  requireSignIn,
  leaderboardController,
  forgetPasswordController,
  checkUserIdController,
  confirmOtpController,
  newPasswordController,
} = require("../controllers/userController");

//router object
const router = express.Router();

//route
//signup || post
router.post("/signup", signupController);

//signin || post
router.post("/signin", signinController);

//update || put
router.put("/update-user", requireSignIn, updateUserController);

router.get("/leaderboard", leaderboardController);

router.post("/check-user-id", checkUserIdController);

router.post("/forget-password", forgetPasswordController); // เพิ่มเส้นทางนี้
router.post("/confirm-otp", confirmOtpController); // เพิ่มเส้นทางนี้

router.post("/new-password", newPasswordController); // เพิ่มเส้นทางนี้

//export
module.exports = router;
