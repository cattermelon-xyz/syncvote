const express = require('express');
const router = express.Router();
const VoteController = require('../controllers/VoteController');

router.post('/create', VoteController.voting);

module.exports = router;
