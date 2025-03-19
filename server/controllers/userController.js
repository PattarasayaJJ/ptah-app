const JWT = require("jsonwebtoken");
const userModel = require("../models/userModel");
const OTP = require("../models/otpModel");
const otpGenerator = require("otp-generator");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
var { expressjwt: jwt } = require("express-jwt");

// Middleware
const requireSignIn = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  credentialsRequired: true, // Ensure token is required
  requestProperty: "auth", // Attach auth info to req object
});

// Signup Controller
const signupController = async (req, res) => {
  try {
    const { ID_card_number, password, name, surename, email } = req.body;

    // Validation
    if (!ID_card_number) {
      return res.status(400).send({
        success: false,
        message: "ID card number is required",
      });
    }
    if (!password || password.length < 10) {
      return res.status(400).send({
        success: false,
        message: "Password must be at least 10 characters",
      });
    }
    if (!name || !surename) {
      return res.status(400).send({
        success: false,
        message: "Name and Surname are required",
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ ID_card_number });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "User already signed up with this ID card number",
      });
    }

    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).send({
        success: false,
        message: "User already signed up with this email",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Save user
    const user = await userModel.create({
      ID_card_number,
      password: hashedPassword,
      name,
      surename,
      email,
    });

    return res.status(201).send({
      success: true,
      message: "Signup successful, please sign in",
      user: { ID_card_number, name, surename, email },
    });
  } catch (error) {
    console.error("Error in signupController:", error);
    return res.status(500).send({
      success: false,
      message: "Error in signup API",
      error: error.message,
    });
  }
};

// Signin Controller
const signinController = async (req, res) => {
  try {
    const { ID_card_number, password } = req.body;

    // Validation
    if (!ID_card_number || !password) {
      return res.status(400).send({
        success: false,
        message: "ID card number and Password are required",
      });
    }

    // Find user
    const user = await userModel.findOne({ ID_card_number });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "ไม่พบผู้ใช้งาน",
      });
    }

    // Check permission (physicalTherapy)
    if (user.physicalTherapy === false) {
      return res.status(403).send({
        success: false,
        message: "บัญชีนี้ไม่มีสิทธ์เข้าใช้งานPTAH Applicaion",
      });
    }

    // Match password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).send({
        success: false,
        message: "รหัสผ่านไม่ถูกต้อง",
      });
    }

    // Generate JWT Token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Remove password before sending user data
    user.password = undefined;

    res.status(200).send({
      success: true,
      message: "Signin successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Error in signinController:", error);
    return res.status(500).send({
      success: false,
      message: "Error in signin API",
      error: error.message,
    });
  }
};

// Update User Controller
const updateUserController = async (req, res) => {
  try {
    const { ID_card_number, name, surename, password } = req.body;

    // Validation
    if (!ID_card_number) {
      return res.status(400).send({
        success: false,
        message: "ID card number is required",
      });
    }

    // Find user
    const user = await userModel.findOne({ ID_card_number });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Update data
    const updates = {};
    if (name) updates.name = name;
    if (surename) updates.surename = surename;
    if (password) {
      if (password.length < 10) {
        return res.status(400).send({
          success: false,
          message: "Password must be at least 10 characters long",
        });
      }
      updates.password = await hashPassword(password);
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { ID_card_number },
      { $set: updates },
      { new: true }
    );

    // Remove password before sending updated user data
    updatedUser.password = undefined;

    res.status(200).send({
      success: true,
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateUserController:", error);
    return res.status(500).send({
      success: false,
      message: "Error in update user API",
      error: error.message,
    });
  }
};

const leaderboardController = async (req, res) => {
  try {
    const users = await userModel
      .find({ physicalTherapy: true })
      .sort({ stars: -1, lastStarredAt: -1 })
      .select("_id name surname stars"); // เพิ่ม _id ใน select

    res.status(200).json({
      success: true,
      leaderboard: users.map((user) => ({
        id: user._id, // เปลี่ยน _id เป็น id
        name: user.name,
        surname: user.surname,
        stars: user.stars,
      })),
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching leaderboard",
      error: error.message,
    });
  }
};

const forgetPasswordController = async (req, res) => {
  try {
    const { idCardNumber } = req.body;

    // Find user by username
    const user = await userModel.findOne({ ID_card_number: idCardNumber });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "ไม่พบเลขบัตรประชาชนนี้ในระบบ",
      });
    }

    const email = user.email;

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    res.status(200).json({ msg: "Password reset email sent", otp });
  } catch (error) {
    console.error("Error in forgetPasswordController:", error);
    return res.status(500).send({
      success: false,
      message: "Error in forget password API",
      error: error.message,
    });
  }
};

const confirmOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error otp",
      error: error.message,
    });
  }
};

const checkUserIdController = async (req, res) => {
  try {
    const users = await userModel.findOne({
      ID_card_number: req.body.idCardNumber,
    });

    if (!users) {
      return res.status(200).send({ // ✅ เปลี่ยนจาก 404 เป็น 200
        success: false,
        message: "ไม่พบเลขบัตรประชาชนนี้ในระบบ",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        email: users.email,
        idCardNumber: users.ID_card_number,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching leaderboard",
      error: error.message,
    });
  }
};

const newPasswordController = async (req, res) => {
  try {
    const { idCardNumber, password } = req.body;

    const users = await userModel.findOne({
      ID_card_number: idCardNumber,
    });

    if (!users) {
      return res.status(200).send({ // ✅ เปลี่ยนจาก 404 เป็น 200
        success: false, // ✅ success เป็น false เพื่อให้ frontend ตรวจจับได้
        message: "ไม่พบเลขบัตรประชาชนนี้ในระบบ",
      });
    }

    const updates = {};
    if (password) {
      if (password.length < 10) {
        return res.status(400).send({
          success: false,
          message: "Password must be at least 10 characters long",
        });
      }
      updates.password = await hashPassword(password);
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { ID_card_number: idCardNumber },
      { $set: updates },
      { new: true }
    );

    // Remove password before sending updated user data
    updatedUser.password = undefined;

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching leaderboard",
      error: error.message,
    });
  }
};

module.exports = {
  signupController,
  signinController,
  updateUserController,
  requireSignIn,
  leaderboardController,
  forgetPasswordController,
  checkUserIdController,
  confirmOtpController,
  newPasswordController,
};
