const TopicService = require('../services/TopicDemoService');
const { supabase } = require('../configs/supabaseClient');

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
    const response = await TopicService.moveTopic(req.body);
    await TopicService.updatePost({
      raw: req.body.raw,
      mission_id: req.body.mission_id,
    });
    await supabase
      .from('demo_missions')
      .update({
        status: 'onchain_voting',
      })
      .eq('id', req.body.mission_id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

const getPost = async (req, res) => {
  console.log('get-post');
  try {
    const raw = await TopicService.getPost(req.body);
    return res.status(200).json({
      raw,
    });
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

const moveTopic = async (req, res) => {
  try {
    const response = await TopicService.moveTopic(req.body);
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
  getPost,
  moveTopic,
  updateDescAndMoveCategory,
};
