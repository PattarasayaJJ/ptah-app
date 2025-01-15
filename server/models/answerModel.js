const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  userId: String,
  answers: [{ name: String, result: Boolean }],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// ระบุชื่อคอลเลคชันอย่างชัดเจนให้เป็น "Answer"
module.exports = mongoose.model("Answer", AnswerSchema);
