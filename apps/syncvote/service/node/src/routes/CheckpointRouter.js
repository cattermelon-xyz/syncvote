const express = require('express');
const router = express.Router();
const CheckpointController = require('../controllers/CheckpointController');

router.post('/create', CheckpointController.createCheckpoint);
router.get('/get-checkpoints', CheckpointController.getAllCheckpoint);

module.exports = router;
