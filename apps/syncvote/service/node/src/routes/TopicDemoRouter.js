const express = require('express');
const router = express.Router();
const TopicController = require('../controllers/TopicDemoController');

router.post('/create', TopicController.createTopic);
router.get('/get-posts', TopicController.getPosts);
router.post('/get-post', TopicController.getPost);
router.post('/update-category', TopicController.moveTopic);
router.post(
  '/update-desc-and-move-category',
  TopicController.updateDescAndMoveCategory
);

module.exports = router;
