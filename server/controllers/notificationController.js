const mongoose = require("mongoose");
const NotificationModel = require("../models/notificationModel");

// Get All Posts
const getAllNotificationController = async (req, res) => {
  try {
    const notifications = await NotificationModel.find();

    res.status(200).send({
      success: true,
      message: "All notifications retrieved successfully",
      notifications,
    });
  } catch (error) {
    console.error("Error in get all notifications:", error);
    res.status(500).send({
      success: false,
      message: "Error in get all notifications API",
      error,
    });
  }
};

module.exports = {
  getAllNotificationController,
};
