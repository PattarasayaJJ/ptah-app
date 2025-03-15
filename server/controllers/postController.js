const mongoose = require('mongoose');
const postModel = require('../models/postModel');
const User = require('../models/userModel');

// Create Post
const createPostController = async (req, res) => {
  try {
    const { title, content, tag } = req.body;
    if (!title || !content || !tag) {
      return res.status(400).send({ success: false, message: "Please provide all fields" });
    }

    const post = await postModel.create({
      title,
      content,
      tag,
      postedBy: req.auth._id,
    });

    res.status(201).send({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("Error in create post:", error);
    res.status(500).send({
      success: false,
      message: "Error in create post API",
      error,
    });
  }
};

// Get All Posts
const getAllpostController = async (req, res) => {
  try {
    const posts = await postModel
    .find()
    .populate('postedBy', 'name') 
    .populate('comments.postedByUser', 'name')
    .populate('comments.postedByPersonnel', 'nametitle name surname') // อัปเดตตรงนี้
    .populate('comments.replies.postedByUser', 'name')
    .populate('comments.replies.postedByPersonnel', 'nametitle name surname') // อัปเดตตรงนี้
    .sort({ createdAt: -1 });
  

    res.status(200).send({
      success: true,
      message: "All posts retrieved successfully",
      posts,
    });
  } catch (error) {
    console.error("Error in get all posts:", error);
    res.status(500).send({
      success: false,
      message: "Error in get all posts API",
      error,
    });
  }
};




// Get User Posts
const getUserPostsController = async (req, res) => {
  try {
    const userPosts = await postModel.find({ postedBy: req.auth._id }).sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "User posts retrieved successfully",
      userPosts, // เปลี่ยนจาก posts เป็น userPosts
    });
  } catch (error) {
    console.error("Error in get user posts:", error);
    res.status(500).send({
      success: false,
      message: "Error in get user posts API",
      error,
    });
  }
};


const deletePostController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ success: false, message: "Invalid post ID" });
    }

    const post = await postModel.findOneAndDelete({
      _id: id,
      postedBy: req.auth._id, // ตรวจสอบว่าเป็นเจ้าของโพสต์
    });

    if (!post) {
      return res.status(404).send({ success: false, message: "Post not found or unauthorized" });
    }

    res.status(200).send({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error in delete post:", error);
    res.status(500).send({
      success: false,
      message: "Error in delete post API",
      error,
    });
  }
};


// Update Post
const updatePostController = async (req, res) => {
  try {
    const { title, content, tag } = req.body;
    const { id } = req.params;

    if (!title || !content || !tag) {
      return res.status(400).send({ success: false, message: "Please provide all fields" });
    }

    const updatedPost = await postModel.findByIdAndUpdate(
      id,
      { title, content, tag },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).send({ success: false, message: "Post not found" });
    }

    res.status(200).send({
      success: true,
      message: "Post updated successfully",
      updatedPost,
    });
  } catch (error) {
    console.error("Error in update post:", error);
    res.status(500).send({
      success: false,
      message: "Error in update post API",
      error,
    });
  }
};

// Add Comment
const addCommentController = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    if (!text.trim()) {
      return res.status(400).send({ success: false, message: "Comment text is required" });
    }

    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).send({ success: false, message: "Post not found" });
    }

    const newComment = {
      text,
      postedByUser: req.auth._id, // สลับกับ postedByPersonnel ตามการยืนยันว่าเป็น user หรือ personnel
      created: Date.now(),
    };

    post.comments.push(newComment);
    await post.save();

    const updatedPost = await postModel
  .findById(postId)
  .populate('comments.postedByUser', 'name')
  .populate('comments.postedByPersonnel', 'nametitle name surname') // อัปเดตตรงนี้
  .populate('comments.replies.postedByUser', 'name')
  .populate('comments.replies.postedByPersonnel', 'nametitle name surname'); // อัปเดตตรงนี้

    res.status(200).send({
      success: true,
      message: "Comment added successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error in add comment:", error);
    res.status(500).send({
      success: false,
      message: "Error in add comment API",
      error,
    });
  }
};





// Add Reply
const addReplyController = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { text } = req.body;

    if (!text.trim()) {
      return res.status(400).send({ success: false, message: "Reply text is required" });
    }

    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).send({ success: false, message: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).send({ success: false, message: "Comment not found" });
    }

    // ถ้า replies ยังไม่ได้ถูกสร้าง จะทำการสร้างขึ้นมาใหม่
    if (!Array.isArray(comment.replies)) {
      comment.replies = [];
    }

    const newReply = {
      text,
      postedByUser: req.auth._id, // เช็คว่าเป็นผู้ใช้หรือเจ้าหน้าที่
      created: Date.now(),
    };

    comment.replies.push(newReply);
    await post.save();

    const updatedPost = await postModel
  .findById(postId)
  .populate('comments.postedByUser', 'name')
  .populate('comments.postedByPersonnel', 'nametitle name surname') // อัปเดตตรงนี้
  .populate('comments.replies.postedByUser', 'name')
  .populate('comments.replies.postedByPersonnel', 'nametitle name surname'); // อัปเดตตรงนี้


    res.status(200).send({
      success: true,
      message: "Reply added successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error in add reply:", error);
    res.status(500).send({
      success: false,
      message: "Error in add reply API",
      error,
    });
  }
};

// Delete Comment
const deleteCommentController = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).send({ success: false, message: "Post not found" });
    }

    const comment = post.comments.find((c) => c._id.toString() === commentId);
    if (!comment) {
      return res.status(404).send({ success: false, message: "Comment not found" });
    }

    // ตรวจสอบสิทธิ์การลบ โดยเช็คทั้ง postedByUser และ postedByPersonnel
    if (
      (!comment.postedByUser || !comment.postedByUser.equals(req.auth._id)) &&
      (!comment.postedByPersonnel || !comment.postedByPersonnel.equals(req.auth._id))
    ) {
      return res.status(403).send({ success: false, message: "You can only delete your own comments" });
    }

    // ลบคอมเมนต์ออกจากโพสต์
    post.comments = post.comments.filter((c) => c._id.toString() !== commentId);
    await post.save();

    res.status(200).send({
      success: true,
      message: "Comment deleted successfully",
      post,
    });
  } catch (error) {
    console.error("Error in delete comment:", error);
    res.status(500).send({
      success: false,
      message: "Error in delete comment API",
      error,
    });
  }
};

const deleteReplyController = async (req, res) => {
  try {
    const { postId, commentId, replyId } = req.params;

    // ค้นหาโพสต์จาก postId
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // ค้นหาคอมเมนต์ในโพสต์จาก commentId
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    // ค้นหารีพลายในคอมเมนต์โดยใช้ .find() เพื่อเปรียบเทียบ _id เป็น string
    const reply = comment.replies.find(r => r._id.toString() === replyId);
    if (!reply) {
      return res.status(404).json({ success: false, message: "Reply not found" });
    }

    // ตรวจสอบสิทธิ์การลบ (ให้ลบได้เฉพาะเจ้าของรีพลาย)
    // ในที่นี้ตรวจสอบเฉพาะ postedByUser แต่หากมี postedByPersonnel ให้ปรับเงื่อนไขเพิ่มเติม
    if (!reply.postedByUser || !reply.postedByUser.equals(req.auth._id)) {
      return res.status(403).json({ success: false, message: "You can only delete your own replies" });
    }

    // ลบรีพลายออกจาก replies array โดยใช้ .filter()
    comment.replies = comment.replies.filter(r => r._id.toString() !== replyId);

    // บันทึกโพสต์ที่อัปเดตแล้ว
    await post.save();

    // ดึงโพสต์ที่อัปเดตใหม่พร้อม populate ให้ข้อมูลครบถ้วน
    const updatedPost = await postModel.findById(postId).populate([
      { path: 'comments.postedByUser', select: 'name' },
      { path: 'comments.postedByPersonnel', select: 'nametitle name surname' },
      { path: 'comments.replies.postedByUser', select: 'name' },
      { path: 'comments.replies.postedByPersonnel', select: 'nametitle name surname' }
    ]);

    return res.status(200).json({
      success: true,
      message: "Reply deleted successfully",
      comments: updatedPost.comments,
    });
  } catch (error) {
    console.error("Error in delete reply:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error in delete reply API",
      error: error.message,
    });
  }
};








module.exports = {
  createPostController,
  getAllpostController,
  getUserPostsController,
  deletePostController,
  updatePostController,
  addCommentController,
  deleteCommentController,
  addReplyController,
  deleteReplyController
  
};
