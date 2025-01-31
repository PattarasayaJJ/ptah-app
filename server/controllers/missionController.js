const mongoose = require("mongoose");
const UserModel = require("../models/userModel");
const MissionModel = require("../models/missionModel");
const SubMissionModel = require("../models/subMissionModel");
const EvaluateModel = require("../models/evaluateModel");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// Create Mission
const createMissionController = async (req, res) => {
  try {
    const { no, name } = req.body;
    if (!no || !name) {
      return res
        .status(400)
        .send({ success: false, message: "Please provide all fields" });
    }

    const mission = await MissionModel.create({
      name,
      no,
    });

    res.status(201).send({
      success: true,
      message: "mission created successfully",
      mission,
    });
  } catch (error) {
    console.error("Error in create mission:", error);
    res.status(500).send({
      success: false,
      message: "Error in create mission API",
      error,
    });
  }
};

// Get All mission
// const getAllMissionController = async (req, res) => {
//   try {
//     console.log("req", req);

//     const mission = await MissionModel.find();

//     res.status(200).send({
//       success: true,
//       message: "All mission retrieved successfully",
//       mission,
//     });
//   } catch (error) {
//     console.error("Error in get all mission:", error);
//     res.status(500).send({
//       success: false,
//       message: "Error in get all mission API",
//       error,
//     });
//   }
// };
const getAllMissionController = async (req, res) => {
  try {
    console.log("req", req);

    const missions = await MissionModel.find();

    // ตรวจสอบแต่ละ mission ที่มี isEvaluate === true
    const updatedMissions = await Promise.all(
      missions.map(async (mission) => {
        if (mission.isEvaluate) {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // ตั้งเวลาเป็น 00:00:00 เพื่อตรวจสอบเฉพาะวัน

          const evaluate = await EvaluateModel.findOne({
            missionId: mission._id,
            created_at: {
              $gte: today, // ตรวจสอบว่ามีบันทึกที่ถูกสร้างวันนี้หรือไม่
              $lt: new Date(today.getTime() + 86400000), // ภายในวันเดียวกัน
            },
          });

          return {
            ...mission.toObject(),
            isEvaluatedToday: evaluate ? 1 : 0,
          };
        }
        return {
          ...mission.toObject(),
          isEvaluatedToday: null,
        };
      })
    );

    res.status(200).send({
      success: true,
      message: "All missions retrieved successfully",
      missions: updatedMissions,
    });
  } catch (error) {
    console.error("Error in get all missions:", error);
    res.status(500).send({
      success: false,
      message: "Error in get all missions API",
      error,
    });
  }
};

// Create sub Mission
const createSubMissionController = async (req, res) => {
  try {
    const { videoUrl, photoUrl, evaluate, name } = req.body;
    if (!videoUrl || !photoUrl || !name) {
      return res
        .status(400)
        .send({ success: false, message: "Please provide all fields" });
    }

    const subMission = await SubMissionModel.create({
      name,
      videoUrl,
      photoUrl,
      evaluate: !evaluate ? false : evaluate,
    });

    res.status(201).send({
      success: true,
      message: "subMission created successfully",
      subMission,
    });
  } catch (error) {
    console.error("Error in create subMission:", error);
    res.status(500).send({
      success: false,
      message: "Error in create subMission API",
      error,
    });
  }
};

// Update Submission
const updateSubmissionController = async (req, res) => {
  try {
    const { id } = req.params; // รับ id ของ mission จาก URL
    const { submission } = req.body; // รับ submission array จาก body

    if (!id || !submission) {
      return res.status(400).send({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // ตรวจสอบว่า submission เป็น array หรือไม่
    if (!Array.isArray(submission)) {
      return res.status(400).send({
        success: false,
        message: "Submission must be an array of strings",
      });
    }

    // ค้นหาและอัปเดต submission ในเอกสาร
    const updatedMission = await MissionModel.findByIdAndUpdate(
      id,
      { submission },
      { new: true } // คืนค่าเอกสารหลังอัปเดต
    );

    if (!updatedMission) {
      return res
        .status(404)
        .send({ success: false, message: "Mission not found" });
    }

    res.status(200).send({
      success: true,
      message: "Submission updated successfully",
      mission: updatedMission,
    });
  } catch (error) {
    console.error("Error in update submission:", error);
    res.status(500).send({
      success: false,
      message: "Error in update submission API",
      error,
    });
  }
};

const getSubmissionDataController = async (req, res) => {
  try {
    const { id } = req.params; // รับ mission ID จาก URL

    // ค้นหา mission ตาม id
    const mission = await MissionModel.findById(id);
    if (!mission) {
      return res.status(404).send({
        success: false,
        message: "Mission not found",
      });
    }

    // ตรวจสอบว่ามี submission หรือไม่
    if (!mission.submission || mission.submission.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No submission data available",
        data: [],
      });
    }
    console.log("mission", mission);

    // Loop หา SubMission ตาม ID ใน submission
    const submissions = [];
    mission.submission.map(async (submissionId) => {
      // ค้นหา SubMission ทีละ ID
      console.log("submissionId", submissionId);

      const data = await SubMissionModel.findById(submissionId);
      console.log("data", data);
      submissions.push(data || null);
      // return data || null; // ถ้าไม่เจอคืนค่า null
    });
    await delay(200);

    // ส่งผลลัพธ์กลับ
    res.status(200).send({
      success: true,
      message: "Submission data retrieved successfully",
      data: {
        mission,
        submissions,
      },
    });
  } catch (error) {
    console.error("Error in getting submission data:", error);
    res.status(500).send({
      success: false,
      message: "Error in getting submission data API",
      error,
    });
  }
};

// send Evaluate
const snedEvaluateController = async (req, res) => {
  try {
    const { userId, missionId, suggestion, answers, timeSpent } = req.body;
    if (!userId || !missionId || !timeSpent || !answers) {
      return res
        .status(400)
        .send({ success: false, message: "Please provide all fields" });
    }

    const evaluate = await EvaluateModel.create({
      userId,
      missionId,
      suggestion,
      answers,
      timeSpent,
    });

    res.status(201).send({
      success: true,
      message: "evaluate created successfully",
      evaluate,
      // user,
    });
  } catch (error) {
    console.error("Error in create evaluate:", error);
    res.status(500).send({
      success: false,
      message: "Error in create evaluate API",
      error,
    });
  }
};

const addStarToUserController = async (req, res) => {
  try {
    console.log("Checking if user qualifies for stars...");

    const { userId } = req.body;
    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "User ID is required",
      });
    }

    // ดึง missions ที่มี isEvaluate === true
    const missionsToEvaluate = await MissionModel.find({ isEvaluate: true });

    // ตรวจสอบว่าทุก mission ที่ต้องมีการประเมินได้รับการประเมินวันนี้หรือไม่
    const allEvaluatedToday = missionsToEvaluate.every(
      (mission) => mission.isEvaluatedToday === 1
    );

    if (allEvaluatedToday) {
      // อัปเดตดาวของ User
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found",
        });
      }

      // เพิ่มค่า stars ของ user +1
      const updateUser = await UserModel.findByIdAndUpdate(
        userId,
        { $inc: { stars: 1 } }, // เพิ่มค่า stars +1
        { new: true } // คืนค่าผู้ใช้หลังจากอัปเดต
      );

      return res.status(200).send({
        success: true,
        message: "User received a star!",
        updateUser,
      });
    }

    res.status(400).send({
      success: false,
      message: "Not all missions have been evaluated today",
    });
  } catch (error) {
    console.error("Error in addStarToUserController:", error);
    res.status(500).send({
      success: false,
      message: "Error in adding stars to user",
      error,
    });
  }
};

module.exports = {
  createMissionController,
  getAllMissionController,
  createSubMissionController,
  updateSubmissionController,
  getSubmissionDataController,
  snedEvaluateController,
  addStarToUserController,
};
