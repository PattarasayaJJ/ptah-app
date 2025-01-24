const mongoose = require("mongoose");

// const SubcategorySchema = new mongoose.Schema({
//     name: String,
//     isCompleted: { type: Boolean, default: false },
//     difficulty: { type: String, enum: ['ง่าย', 'ปานกลาง', 'ยาก'], default: null }
//   });

const MissionsSchema = new mongoose.Schema({
  no: Number,
  name: String,
  subcategories: { type: String, default: null },
  isCompleted: { type: Boolean, default: false },
  completedAt: Date,
});

module.exports = mongoose.model("Missions", MissionsSchema);
