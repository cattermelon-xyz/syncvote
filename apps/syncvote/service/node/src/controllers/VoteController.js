<<<<<<< HEAD
const VoteHandleService = require('../services/VoteHandleService');

const voting = async (req, res) => {
  try {
    const { who, option, voting_power, mission_id } = req.body;
    if (!who || !option || !voting_power || !mission_id) {
=======
const VoteRecordService = require('../services/VoteRecordService');

const voting = async (req, res) => {
  try {
    const { who, option, voting_power, current_vote_data_id } = req.body;
    if (!who || !option || !voting_power || !current_vote_data_id) {
>>>>>>> main
      return res.status(200).json({
        status: 'ERR',
        message: 'The input is required',
      });
    }

<<<<<<< HEAD
    const respone = await VoteHandleService.handleVoting(req.body);
=======
    const respone = await VoteRecordService.insertVoteRecord(req.body);
>>>>>>> main
    return res.status(200).json(respone);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  voting,
};
