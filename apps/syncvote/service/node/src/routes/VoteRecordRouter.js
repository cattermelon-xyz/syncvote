const express = require('express');
const router = express.Router();
const VoteRecordController = require('../controllers/VoteRecordController');

router.post('/create-vote-record', VoteRecordController.createVoteRecord);
router.get('/get-vote-records', VoteRecordController.getAllVoteRecord);

module.exports = router;
