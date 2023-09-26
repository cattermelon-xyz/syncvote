const express = require('express');
const router = express.Router();
const VoteRecordController = require('../controllers/VoteRecordController');

router.post('/create', VoteRecordController.createVoteRecord);
router.get('/get-all', VoteRecordController.getAllVoteRecord);

module.exports = router;
