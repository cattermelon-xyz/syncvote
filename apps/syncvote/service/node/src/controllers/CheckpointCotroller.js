const CheckpointService = require('../services/CheckpointService');

const createCheckpoint = async (req, res) => {
  try {
    const {
      id,
      vote_machine_type,
      childrens,
      mission_id,
      duration,
      participation,
      delays,
      delayUnits,
      quorum,
      options,
    } = req.body;
    if (
      !id ||
      !vote_machine_type ||
      !mission_id ||
      !participation ||
      !quorum ||
      !options
    ) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The input is required',
      });
    }

    const respone = await CheckpointService.insertCheckpoint(req.body);
    return res.status(200).json(respone);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllCheckpoint = async (req, res) => {
  try {
    const respone = await CheckpointService.getAllCheckpoint();
    return res.status(200).json(respone);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createMission,
  getAllCheckpoint,
};
