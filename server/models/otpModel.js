const mongoose = require("mongoose");
const { sendEmail } = require("../services/mailer"); // Correct the import statement

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5,
  },
});
otpSchema.pre("save", async function (next) {
  console.log("New document saved to the database");
  // Only send an email when a new document is created
  if (this.isNew) {
    await sendEmail(
      this.email,
      "การรีเซ็ตรหัสผ่าน",
      "",
      `<h1>Please confirm your OTP</h1>
		<p>Here is your OTP code: ${this.otp}</p>`
    );
  }
  next();
});
module.exports = mongoose.model("Otp", otpSchema, "Otp");
