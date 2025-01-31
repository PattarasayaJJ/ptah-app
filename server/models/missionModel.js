const mongoose = require("mongoose");

const MissionsSchema = new mongoose.Schema({
  no: Number,
  name: String,
  submission: { type: [String], default: null },
  isEvaluate: { type: Boolean, default: false },
  completedAt: Date,
});

module.exports = mongoose.model("Missions", MissionsSchema);
