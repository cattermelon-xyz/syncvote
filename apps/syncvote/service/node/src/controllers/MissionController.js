const MissionService = require('../services/MissionService');

const createMission = async (req, res) => {
  try {
    const { creator_id, status } = req.body;
    if (!status || !creator_id) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The input is required',
      });
    }

    const respone = await MissionService.insertMisson(req.body);
    return res.status(200).json(respone);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllMission = async (req, res) => {
  try {
    const respone = await MissionService.getAllMission();
    return res.status(200).json(respone);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateMission = async (req, res) => {
  try {
    const { params, mission_id } = req.body;
    if (!params || !mission_id) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The input is required',
      });
    }

    const respone = await MissionService.updateMission(req.body);
    return res.status(200).json(respone);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createMission,
  getAllMission,
  updateMission,
};
