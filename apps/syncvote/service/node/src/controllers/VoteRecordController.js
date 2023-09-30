const VoteRecordService = require('../services/VoteRecordService');

const createVoteRecord = async (req, res) => {
  try {
    const { who, option, voting_power, current_vote_data_id } = req.body;
    if (!who || !option || !voting_power || !current_vote_data_id) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The input is required',
      });
    }

    const respone = await VoteRecordService.insertVoteRecord(req.body);
    return res.status(200).json(respone);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllVoteRecord = async (req, res) => {
  try {
    const respone = await VoteRecordService.getAllVoteRecord();
    return res.status(200).json(respone);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createVoteRecord,
  getAllVoteRecord,
};