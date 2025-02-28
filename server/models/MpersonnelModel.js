const mongoose = require("mongoose");

const mpersonnelSchema = new mongoose.Schema(
    {
        nametitle: {
            type: [String], // ใช้ Array ของ String ถ้าข้อมูลจะเป็นลักษณะนี้
            required: true,
            enum: ['นพ', 'พญ', 'อื่นๆ'], // ถ้าต้องการจำกัดค่า
          },
        
        name: String,
        surname: String,
        username: String,
        tel: String,
        email: String,

        isDeleted: {
          type: Boolean,
          default: false,
        },
        isEmailVerified: {
          type: Boolean,
          default: false,
        },
      },
      { collection: "MPersonnel", timestamps: true }
    );
    

module.exports = mongoose.model("MPersonnel", mpersonnelSchema, "MPersonnel");
