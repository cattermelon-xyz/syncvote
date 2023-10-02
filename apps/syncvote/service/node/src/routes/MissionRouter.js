const express = require('express');
const router = express.Router();
const MissionController = require('../controllers/MissionController');

router.post('/create', MissionController.createMission);
router.get('/get-all', MissionController.getAllMission);
<<<<<<< HEAD
router.post('/update', MissionController.updateMission);
=======
>>>>>>> main

module.exports = router;
