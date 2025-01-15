const mongoose = require("mongoose");
const questionModel = require("../models/questionModel");

// Create Question
const createQuestionController = async (req, res) => {
  try {
    const { name, choice } = req.body;
    if (!name || !choice) {
      return res
        .status(400)
        .send({ success: false, message: "Please provide all fields" });
    }

    const question = await questionModel.create({
      name,
      choice,
    });

    res.status(201).send({
      success: true,
      message: "Question created successfully",
      question,
    });
  } catch (error) {
    console.error("Error in create question:", error);
    res.status(500).send({
      success: false,
      message: "Error in create question API",
      error,
    });
  }
};

// Get All Posts
const getAllQuestionController = async (req, res) => {
  try {
    const questions = await questionModel.find();

    res.status(200).send({
      success: true,
      message: "All questions retrieved successfully",
      questions,
    });
  } catch (error) {
    console.error("Error in get all questions:", error);
    res.status(500).send({
      success: false,
      message: "Error in get all questions API",
      error,
    });
  }
};

// Get User Posts
const getQuestionByIdController = async (req, res) => {
  try {
    const question = await questionModel.findById(req.params.id);
    res.status(200).send({
      success: true,
      message: "question retrieved successfully",
      question,
    });
  } catch (error) {
    console.error("Error in get user question:", error);
    res.status(500).send({
      success: false,
      message: "Error in get user question API",
      error,
    });
  }
};

module.exports = {
  createQuestionController,
  getAllQuestionController,
  getQuestionByIdController,
};
