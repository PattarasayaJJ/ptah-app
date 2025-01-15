const mongoose = require("mongoose");
const answerModel = require("../models/answerModel");

// send answer
const snedAnswerController = async (req, res) => {
  try {
    const { userId, answers } = req.body;
    if (!userId || !answers) {
      return res
        .status(400)
        .send({ success: false, message: "Please provide all fields" });
    }

    const answer = await answerModel.create({
      userId,
      answers,
    });

    res.status(201).send({
      success: true,
      message: "answer created successfully",
      answer,
    });
  } catch (error) {
    console.error("Error in create answer:", error);
    res.status(500).send({
      success: false,
      message: "Error in create answer API",
      error,
    });
  }
};

// Get All answer
const getAllanswerController = async (req, res) => {
  try {
    const answer = await answerModel.find();

    res.status(200).send({
      success: true,
      message: "All answer retrieved successfully",
      answer,
    });
  } catch (error) {
    console.error("Error in get all answer:", error);
    res.status(500).send({
      success: false,
      message: "Error in get all answer API",
      error,
    });
  }
};

module.exports = {
  snedAnswerController,
  getAllanswerController,
};
