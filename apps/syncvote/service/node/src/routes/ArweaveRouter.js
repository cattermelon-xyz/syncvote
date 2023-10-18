const express = require('express');
const router = express.Router();
const ArweaveController = require('../controllers/ArweaveController');

router.post('/upload', ArweaveController.uploadMetadata);

module.exports = router;
