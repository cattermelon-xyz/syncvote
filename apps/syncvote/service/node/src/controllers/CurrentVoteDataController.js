const CurrentVoteDataService = require('../services/CurrentVoteDataService');

const createCurrentVoteData = async (req, res) => {
  try {
    const { checkpoint_id } = req.body;
    if (!checkpoint_id) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The input is required',
      });
    }

    const respone = await CurrentVoteDataService.insertCurrentVoteData(
      req.body
    );
    return res.status(200).json(respone);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createCurrentVoteData,
};
