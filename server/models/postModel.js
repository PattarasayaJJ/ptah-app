const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  text: { type: String, required: true },
  created: { type: Date, default: Date.now },
  postedBy: { type: String, required: true }, // เปลี่ยนเป็น String
  refModel: { type: String , enum: ['User', 'MPersonnel'] },
});

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  created: { type: Date, default: Date.now },
  postedBy: { type: String, required: true }, // เปลี่ยนเป็น String
  refModel: { type: String, enum: ['User', 'MPersonnel'] },
  replies: [replySchema],
});

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tag: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [commentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
