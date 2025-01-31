const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    password: String,
    email: { type: String, sparse: true },
    tel: String,
    name: String,
    surname: String,
    gender: String,
    birthday: Date,
    ID_card_number: String,
    nationality: String,
    Address: String,
    stars: { type: Number, default: 0 },
    lastStarredAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null },
    deleteExpiry: { type: Date, default: null },
    AdddataFirst: { type: Boolean, default: false },
    physicalTherapy: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
  },

  {
    collection: "User",
    timestamps: true,
  }
);

// ระบุชื่อคอลเลคชันอย่างชัดเจนให้เป็น "User"
module.exports = mongoose.model("User", userSchema, "User");
