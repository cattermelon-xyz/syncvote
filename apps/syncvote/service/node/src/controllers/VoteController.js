const RegularVotingService = require('../services/VoteHandle/RegularVotingService');
const DocInputVotingService = require('../services/VoteHandle/DocInputVotingService');

const voting = async (req, res) => {
  try {
    const { mission_id, identify } = req.body;
    if (!mission_id || !identify) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The input is required',
      });
    }

    const respone = await RegularVotingService.handleSubmission(req.body);
    return res.status(200).json(respone);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const submitDoc = async (req, res) => {
  try {
    const { identify, option, submission, mission_id } = req.body;
    if (!identify || !option || !submission || !mission_id) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The input is required',
      });
    }

    const respone = await DocInputVotingService.handleSubbmission(req.body);
    return res.status(200).json(respone);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  voting,
  submitDoc,
};
