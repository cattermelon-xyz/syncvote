const express = require('express');
const router = express.Router();
const VoteController = require('../controllers/VoteController');

router.post('/create', VoteController.voting);
router.post('/submit-doc', VoteController.submitDoc);
router.post('/create-topic', VoteController.submitDiscourse);

module.exports = router;
