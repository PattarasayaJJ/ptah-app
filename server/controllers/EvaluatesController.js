const { StatusCodes } = require("http-status-codes");
const Evaluate = require('../models/evaluateModel.js');

const getEvaluates = async (req, res) => {
    try {
        const evaluations = await Evaluate.find();
        if (!evaluations.length) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "ไม่พบข้อมูลที่ต้องการ" });
        }
        res.status(StatusCodes.OK).json(evaluations);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

const getEvaluatesByUserIdAndDate = async (req, res) => {
    try {
        const { id } = req.params;
        const evaluations = await Evaluate.find({ userId: id });
        if (!evaluations.length) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "ไม่พบข้อมูลที่ต้องการ" });
        }
        res.status(StatusCodes.OK).json(evaluations);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

module.exports = { getEvaluates, getEvaluatesByUserIdAndDate };
