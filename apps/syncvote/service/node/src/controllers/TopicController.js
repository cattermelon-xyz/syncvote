const TopicService = require('../services/TopicService');

const getPosts = async (req, res) => {
  try {
    const response = await TopicService.getPosts(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

module.exports = {
  getPosts,
};
