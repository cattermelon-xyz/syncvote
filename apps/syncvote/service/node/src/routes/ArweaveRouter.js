const express = require('express');
const router = express.Router();
var cors = require('cors');

const ArweaveController = require('../controllers/ArweaveController');

router.post('/upload', cors(), ArweaveController.uploadMetadata);

module.exports = router;
