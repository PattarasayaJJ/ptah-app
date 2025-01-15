const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  name: String,
  choice: [{ name: String, result: Boolean }],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// ระบุชื่อคอลเลคชันอย่างชัดเจนให้เป็น "Question"
module.exports = mongoose.model("Question", QuestionSchema);
