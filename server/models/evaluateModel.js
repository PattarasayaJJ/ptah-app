const mongoose = require("mongoose");

const EvaluateSchema = new mongoose.Schema({
  userId: String,
  missionId: String,
  suggestion: String,
  timeSpent: String,
  answers: [{ name: String, result: String }],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Evaluate", EvaluateSchema);
