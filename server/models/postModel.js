const mongoose = require('mongoose');

// Reply Schema
const replySchema = new mongoose.Schema({
  text: { type: String, required: true },
  created: { type: Date, default: Date.now },
  postedByUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  postedByPersonnel: { type: mongoose.Schema.Types.ObjectId, ref: 'MPersonnel' }, 
});

// Comment Schema
const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  created: { type: Date, default: Date.now },
  postedByUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  postedByPersonnel: { type: mongoose.Schema.Types.ObjectId, ref: 'MPersonnel' }, 
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
