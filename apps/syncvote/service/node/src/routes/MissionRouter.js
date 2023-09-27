const express = require('express');
const router = express.Router();
const MissionController = require('../controllers/MissionController');

router.post('/create', MissionController.createMission);
router.get('/get-all', MissionController.getAllMission);
router.post('/update', MissionController.updateMission);

module.exports = router;
