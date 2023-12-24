const express = require('express');
const router = express.Router();
const VoteController = require('../controllers/VoteController');

router.post('/create', VoteController.voting);
router.post('/submit-doc', VoteController.submitDoc);

module.exports = router;
