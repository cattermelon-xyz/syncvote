const TopicService = require('../services/TopicDemoService');

const createTopic = async (req, res) => {
  try {
    const response = await TopicService.createTopic(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

const updateDescAndMoveCategory = async (req, res) => {
  try {
    const response = await TopicService.updateCategory(req.body);
    await TopicService.updatePost({
      raw: req.body.raw,
      mission_id: req.body.mission_id,
    });
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

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

const updateCategory = async (req, res) => {
  try {
    const response = await TopicService.updateCategory(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

module.exports = {
  createTopic,
  getPosts,
  updateCategory,
  updateDescAndMoveCategory,
};
