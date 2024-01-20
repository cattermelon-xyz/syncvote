const express = require('express');
const router = express.Router();
const FinalizeController = require('../controllers/FinalizeController');

router.post('/finalize', FinalizeController.finalize);

module.exports = router;
