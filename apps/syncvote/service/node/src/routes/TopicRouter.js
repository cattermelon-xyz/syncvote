const express = require('express');
const router = express.Router();
const TopicController = require('../controllers/TopicController');

router.post('/create', TopicController.createTopic);
router.get('/get-posts', TopicController.getPosts);
router.post('/update-category', TopicController.updateCategory);

module.exports = router;
