const mongoose = require("mongoose");

const SubMissionsSchema = new mongoose.Schema({
  name: String,
  videoUrl: { type: String, required: true },
  photoUrl: { type: String, required: true },
  evaluate: { type: Boolean, default: false },
  createdAt: Date,
});

module.exports = mongoose.model("SubMissions", SubMissionsSchema);
