const ArweaveService = require('../services/ArweaveService');

const uploadMetadata = async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The input is required',
      });
    }

    const respone = await ArweaveService.uploadMetadata(req.body);
    return res.status(200).json(respone);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  uploadMetadata,
};
