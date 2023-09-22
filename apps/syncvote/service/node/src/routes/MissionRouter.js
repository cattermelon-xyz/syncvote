const express = require('express');
const router = express.Router();
const MissionController = require('../controllers/MissionController');

router.post('/create-mission', MissionController.createMission);
router.get('/get-missions', MissionController.getAllMission);

module.exports = router;
