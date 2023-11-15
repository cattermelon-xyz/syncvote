const PostService = require('../services/PostService');

const createPost = async (req, res) => {
  try {
    const repsonse = await PostService.createPost(req.body);
    return res.status(200).json(repsonse);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

module.exports = {
  createPost,
};
