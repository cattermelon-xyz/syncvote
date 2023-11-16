const express = require('express');
const router = express.Router();
const TopicController = require('../controllers/TopicController');

router.get('/get-posts', TopicController.getPosts);


module.exports = router;
