const FinalizeService = require('../services/FinalizeService');

const finalize = async (req, res) => {
  try {
    const { mission_id } = req.body;
    if (!mission_id) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The input is required',
      });
    }

    const respone = await FinalizeService.finalize(req.body);
    return res.status(200).json(respone);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  finalize,
};
